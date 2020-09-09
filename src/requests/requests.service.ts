import { Injectable, Inject } from '@nestjs/common';
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
    @Inject('ServerService') private serverService: ServersService,
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
      requests = await getConnection().manager.query(
        `EXEC [dbo].[RequestgetListRequests] @PageSize=${pageSize}, @SortOrder='${sortOrder}', @SortBy='${sortColumn}', @PageNumber=${pageNumber}, @SearchKey='${keyword}'`,
      );
    } else
      requests = await getConnection().manager.query(
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

  async createNewRequest(data: CreateRequestDto): Promise<any> {}
}
