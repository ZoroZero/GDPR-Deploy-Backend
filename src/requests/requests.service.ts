import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Request } from './request.entity';
import { request } from 'http';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private RequestRepository: Repository<Request>,
  ) {}

  async findAll({
    UserId,
    role,
    PageSize,
    PageNumber,
    SortBy,
    SortOrder,
    SearchKey,
  }): Promise<any> {
    let requests = null;
    if (role === 'admin' || role === 'dc-member') {
      requests = await getConnection().manager.query(
        `EXEC [dbo].[RequestgetListRequests] @PageSize=${PageSize}, @SortOrder=${SortOrder}, @SortBy='${SortBy}', @PageNumber=${PageNumber}, @SearchKey='${SearchKey}'`,
      );
    } else
      requests = await getConnection().manager.query(
        `EXEC [dbo].[RequestgetListRequests] @UserId='${UserId}', @PageSize=${PageSize}, @SortOrder='${SortOrder}', @SortBy='${SortBy}', @PageNumber=${PageNumber}`,
      );
    const response = {
      data: requests,
      TotalPage: 1,
      CurrentPage: 1,
    };
    if (requests && requests.length > 0) {
      response.TotalPage = Math.ceil(requests[0].Total / PageSize);
      response.CurrentPage = PageNumber;
    }
    return response;
  }
}
