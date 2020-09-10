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
        @StartDate='${new Date(data.startDate)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')}', 
        @EndDate='${new Date(data.endDate)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')}',
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
}
