import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';
import { ServersService } from 'src/servers/servers.service';
import { CreateRequestDto } from './Dto/create-request.dto';
import { MailService } from 'src/mail/mail.service';
import { RequestLogService } from './requestLog.service';
import { exportQueryDto } from './Dto/exportQuery.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private RequestRepository: Repository<Request>,
    private serverService: ServersService,
    private readonly mailService: MailService,
    private readonly requestLogService: RequestLogService,
  ) {}

  async findAll({
    UserId,
    role,
    pageSize,
    pageNumber,
    sortColumn,
    sortOrder,
    keyword,
  }): Promise<any> {
    let requests = null;
    if (role === 'admin' || role === 'dc-member') {
      requests = await this.RequestRepository.query(
        `EXEC [dbo].[RequestgetListRequests] 
          @PageSize=${pageSize},
          @SortOrder='${sortOrder}',
          @SortBy='${sortColumn}',
          @PageNumber=${pageNumber},
          @SearchKey='${keyword}'`,
      );
    } else
      requests = await this.RequestRepository.query(
        `EXEC [dbo].[RequestgetListRequests] 
          @UserId='${UserId}', 
          @PageSize=${pageSize}, 
          @SortOrder='${sortOrder}', 
          @SortBy='${sortColumn}', 
          @PageNumber=${pageNumber}, 
          @SearchKey='${keyword}'`,
      );
    const response = {
      data: requests,
      TotalPage: 1,
      CurrentPage: 1,
    };

    if (requests && requests.length > 0) {
      response.TotalPage = Math.ceil(requests[0].Total / Number(pageSize));
      response.CurrentPage = Number(pageNumber);
    }
    return response;
  }

  async findOne(requestId): Promise<any> {
    return await this.RequestRepository.findOneOrFail(requestId);
  }

  async createNewRequest(data: CreateRequestDto, userId): Promise<any> {
    if (
      new Date(data.endDate) > new Date(data.startDate) &&
      new Date(data.endDate) > new Date()
    ) {
      const [serverName, serverIp] = data.server.split('-');
      const server = await this.serverService.getIdFromIpAndName(
        serverIp,
        serverName,
      );
      if (server && server.Id) {
        const result = await this.RequestRepository.query(
          `EXEC [dbo].[Request_alterRequest] 
          @Title='${data.title}', 
          @Description='${data.description}', 
          @StartDate='${data.startDate}', 
          @EndDate='${data.endDate}',
          @ServerId='${server.Id}',
          @CreatedBy='${userId}'`,
        );
        console.log(result);
        if (result[0] && result[0].Id) {
          this.requestLogService.logNew_Approve_Close_Request(
            result[0].Id,
            userId,
            'create new request',
          );
          this.sendMailForNew_Approve_Close_Request(
            'create new request',
            'new',
            userId,
          );
        }
        return result;
      } else
        throw new HttpException(
          'Server is invalid',
          HttpStatus.EXPECTATION_FAILED,
        );
    } else
      throw new HttpException(
        'Invalid start date and end date',
        HttpStatus.EXPECTATION_FAILED,
      );
  }

  async approveRequest(requestId, userId): Promise<any> {
    try {
      const req = await this.RequestRepository.findOne(requestId);
      if (req && !req.IsClosed) {
        this.RequestRepository.query(
          `
      EXEC [dbo].[Request_approveOrCloseRequest] 
        @requestId='${requestId}', 
        @IsApproved=${true}, 
        @IsClosed=${false}, 
        @ApprovedBy='${userId}'
    `,
        ).then(() => {
          this.requestLogService.logNew_Approve_Close_Request(
            requestId,
            userId,
            'approve request',
          );
          this.sendMailForNew_Approve_Close_Request(
            'approve request',
            'approve',
            userId,
            req,
          );
        });
      }
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async closeRequest(requestId, userId): Promise<any> {
    try {
      const req = await this.RequestRepository.findOne(requestId);
      if (req && !req.IsClosed) {
        this.RequestRepository.query(
          `
            EXEC [dbo].[Request_approveOrCloseRequest] 
              @requestId='${requestId}', 
              @IsApproved=${req.IsApproved},
              @IsClosed=${true},
              @ApprovedBy='${userId}'
          `,
        ).then(() => {
          this.requestLogService.logNew_Approve_Close_Request(
            requestId,
            userId,
            'close request',
          );
          this.sendMailForNew_Approve_Close_Request(
            'close request',
            'close',
            userId,
            req,
          );
        });
      }
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async getRequestById(requestId, user): Promise<any> {
    let request = [];
    if (user.role === 'admin' || user.role === 'dc-member') {
      request = await this.RequestRepository.query(`
        EXEC [dbo].[Request_getRequestDetail] 
          @requestId='${requestId}'
    `);
    } else {
      request = await this.RequestRepository.query(`
        EXEC [dbo].[Request_getRequestDetail] 
          @requestId='${requestId}', 
          @userId='${user.UserId}'
    `);
    }
    if (request && request.length > 0) {
      const logs = await this.requestLogService.getLogsByRequestId(requestId);
      let response = {
        detail: request[0],
        logs: logs,
      };
      return response;
    }
    throw new HttpException('Request does not exists', HttpStatus.NOT_FOUND);
  }

  async updateRequestDetail(requestDetail, userId, requestId): Promise<any> {
    if (
      new Date(requestDetail.startDate) < new Date(requestDetail.endDate) &&
      new Date(requestDetail.endDate) > new Date()
    ) {
      const oldReq = await this.RequestRepository.findOne(requestId);
      if (oldReq && !oldReq.IsClosed && !oldReq.IsApproved) {
        const lstDifference = await this.compareRequest(requestDetail, oldReq);
        if (lstDifference.length > 0) {
          const [serverName, serverIp] = requestDetail.server.split('-');
          const server = await this.serverService.getIdFromIpAndName(
            serverIp,
            serverName,
          );
          if (server && server.Id) {
            return await this.RequestRepository.query(
              `EXEC [dbo].[Request_alterRequest] 
                @Id='${requestId}',
                @Title='${requestDetail.title}', 
                @Description='${requestDetail.description}', 
                @StartDate='${requestDetail.startDate}', 
                @EndDate='${requestDetail.endDate}',
                @ServerId='${server.Id}',
                @UpdatedBy='${userId}'`,
            ).then(() => {
              this.requestLogService.logNew_Approve_Close_Request(
                requestId,
                userId,
                lstDifference.join(', '),
              );
              this.sendMailForNew_Approve_Close_Request(
                lstDifference.join(', '),
                'update',
                userId,
                oldReq,
              );
            });
          } else
            throw new HttpException(
              'Server is invalid',
              HttpStatus.EXPECTATION_FAILED,
            );
        }
      }
    } else
      throw new HttpException(
        'Invalid start date and end date',
        HttpStatus.EXPECTATION_FAILED,
      );
  }

  async sendMailForNew_Approve_Close_Request(
    content: string,
    type: string,
    userId,
    request = null,
  ) {
    try {
      const lstEmailObject = await this.RequestRepository.query(
        `EXEC [dbo].[Request_getListEmailAdminDcmember]`,
      );
      let user, mailContent;
      if (type === 'approve' || type === 'close') {
        user = await this.RequestRepository.query(
          `EXEC [dbo].[getInfoFromId] @Id='${request.CreatedBy}'`,
        );
        mailContent = content + ' ' + request.Number;
      } else if (type === 'new') {
        console.log('BUGGG HEERRRRREEE');
        user = await this.RequestRepository.query(
          `EXEC [dbo].[getInfoFromId] @Id='${userId}'`,
        );
        mailContent = content;
      } else {
        // type=="update"
        user = await this.RequestRepository.query(
          `EXEC [dbo].[getInfoFromId] @Id='${userId}'`,
        );
        mailContent = 'updated request ' + request.Number + ' ' + content;
      }

      if (lstEmailObject && user) {
        const listEmailAdminDcmember = lstEmailObject.map((val, index) => {
          return val.Email;
        });
        listEmailAdminDcmember.push(user[0].Email);
        this.mailService.notifyNewRequest(
          user[0].FirstName + ' ' + user[0].LastName,
          listEmailAdminDcmember,
          mailContent,
        );
      }
    } catch (error) {}
  }

  async compareRequest(newReq, oldReq): Promise<any> {
    try {
      const listDifference = [];
      if (newReq.title !== oldReq.Title) {
        listDifference.push(
          'updated title: ' + oldReq.Title + '->' + newReq.title,
        );
      }
      if (
        new Date(newReq.startDate).toISOString() !==
        new Date(oldReq.StartDate).toISOString()
      ) {
        listDifference.push(
          'updated start date: ' +
            new Date(oldReq.StartDate).toLocaleString() +
            '->' +
            new Date(newReq.startDate).toLocaleString(),
        );
      }
      if (
        new Date(newReq.endDate).toISOString() !==
        new Date(oldReq.EndDate).toISOString()
      ) {
        listDifference.push(
          'updated end date: ' +
            new Date(oldReq.EndDate).toLocaleString() +
            '->' +
            new Date(newReq.endDate).toLocaleString(),
        );
      }
      const old_ServerName_Ip = await this.RequestRepository.query(`
        EXEC [dbo].[Request_getServerNameIpAddressById] @serverId='${oldReq.ServerId}'
      `);
      if (
        old_ServerName_Ip &&
        old_ServerName_Ip[0] &&
        old_ServerName_Ip[0].Server !== newReq.server
      ) {
        listDifference.push(
          'updated server: ' +
            old_ServerName_Ip[0].Server +
            '->' +
            newReq.server,
        );
      }
      if (newReq.description !== oldReq.Description) {
        listDifference.push(
          'updated description: ' +
            oldReq.Description +
            '->' +
            newReq.description,
        );
      }
      return listDifference;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async exportRequest(body: exportQueryDto): Promise<any> {
    const approveParam =
      !body.approvedBy || body.approvedBy === ''
        ? ''
        : `@ApprovedBy='${body.approvedBy}',`;
    const requesterParam =
      !body.createdBy || body.createdBy === ''
        ? ''
        : `@CreatedBy='${body.createdBy}',`;
    const listServerIp = body.server.map(val => {
      return val.split('-')[1];
    });
    const listServerIpParam =
      listServerIp.length > 0
        ? `@ListServerIp='${listServerIp.join(',')}',`
        : '';
    return await this.RequestRepository.query(`
      EXEC [dbo].[Request_exportRequestByServer] ${approveParam} ${requesterParam} ${listServerIpParam} @StartDate='${body.fromDate}', @EndDate='${body.toDate}'
    `);
  }
}
