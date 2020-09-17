import {
  Injectable,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class RequestLogService {
  async logNew_Approve_Close_Request(
    requestId,
    updatedBy,
    content,
  ): Promise<any> {
    getConnection().manager.query(`
      EXEC [dbo].[RequestLog_InsertRequestLog]
      @RequestId='${requestId}',
      @UpdatedBy='${updatedBy}',
      @StatusChange='${content}'
    `);
  }

  async logUpdateRequest(requestId, updatedBy, statusChange): Promise<any> {}

  async getLogsByRequestId(requestId): Promise<any> {
    return await getConnection().manager.query(`
      EXEC [dbo].[RequestLog_getLogsByRequestId] @requestId='${requestId}'
    `);
  }
}
