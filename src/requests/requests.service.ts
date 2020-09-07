import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Request } from './request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private RequestRepository: Repository<Request>,
  ) {}

  async findAll({ UserId, role }): Promise<any> {
    let requests = null;
    if (role === 'admin' || role === 'dc-member')
      requests = await getConnection().manager.query(
        'EXEC [dbo].[RequestgetListRequests]',
      );
    else
      requests = await getConnection().manager.query(
        `EXEC [dbo].[RequestgetListRequests] @UserId='${UserId}' `,
      );
    return requests;
  }
}
