import {
  Injectable,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Request } from './request.entity';
import { request } from 'http';
import { ServersService } from 'src/servers/servers.service';
import { CreateRequestDto } from './Dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private RequestRepository: Repository<Request>,
    private serverService: ServersService,
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
        `EXEC [dbo].[RequestgetListRequests] @PageSize=${pageSize}, @SortOrder='${sortOrder}', @SortBy='${sortColumn}', @PageNumber=${pageNumber}, @SearchKey='${keyword}'`,
      );
    } else
      requests = await this.RequestRepository.query(
        `EXEC [dbo].[RequestgetListRequests] @UserId='${UserId}', @PageSize=${pageSize}, @SortOrder='${sortOrder}', @SortBy='${sortColumn}', @PageNumber=${pageNumber}, @SearchKey='${keyword}'`,
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

  async createNewRequest(data: CreateRequestDto, userId): Promise<any> {
    if (new Date(data.endDate) > new Date(data.startDate)) {
      const [serverName, serverIp] = data.server.split('-');
      const server = await this.serverService.getIdFromIpAndName(
        serverIp,
        serverName,
      );
      if (server && server.Id) {
        return await this.RequestRepository.query(
          `EXEC [dbo].[Request_alterRequest] 
        @Title='${data.title}', 
        @Description='${data.description}', 
        @StartDate='${data.startDate}', 
        @EndDate='${data.endDate}',
        @ServerId='${server.Id}',
        @CreatedBy='${userId}'`,
        );
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
    return await this.RequestRepository.query(`
      EXEC [dbo].[Request_approveOrCloseRequest] @requestId='${requestId}', @IsApproved=${true}, @ApprovedBy='${userId}'
    `);
  }

  async closeRequest(requestId, userId): Promise<any> {
    return await this.RequestRepository.query(`
      EXEC [dbo].[Request_approveOrCloseRequest] @requestId='${requestId}', @IsApproved=${false}, @ApprovedBy='${userId}'
    `);
  }

  async getRequestById(requestId): Promise<any> {
    const request = await this.RequestRepository.query(`
      EXEC [dbo].[Request_getRequestDetail] @requestId='${requestId}'
    `);
    if (request) {
      return request;
    }
    throw new HttpException('Request does not exists', HttpStatus.NOT_FOUND);
  }

  async updateRequestDetail(requestDetail, userId, requestId): Promise<any> {
    if (new Date(requestDetail.startDate) < new Date(requestDetail.endDate)) {
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
        );
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
}
