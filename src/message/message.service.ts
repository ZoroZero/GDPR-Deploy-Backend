import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RequestsService } from 'src/requests/requests.service';
import { getConnection } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(private readonly requestService: RequestsService) {}
  async saveMessage(user, content, requestId, messageId = null): Promise<any> {
    try {
      let result = null;
      if (messageId) {
        result = await getConnection().manager.query(`
                    EXEC [dbo].[Message_saveMessage] 
                    @requestId='${requestId}',
                    @content='${content}',
                    @commentId='${messageId}',
                    @userId='${user.Id}'
                `);
      } else {
        result = await getConnection().manager.query(`
                    EXEC [dbo].[Message_saveMessage] 
                    @requestId='${requestId}',
                    @content='${content}',
                    @userId='${user.Id}'
                `);
      }
      if (result && result.length > 0) return result[0];
    } catch (error) {
      throw new WsException('Invalid credentials.');
    }
  }

  async getMessageByRequestId(requestId, user): Promise<any> {
    let result = [];
    try {
      if (['admin', 'dc-member'].includes(user.role)) {
        result = await getConnection().manager.query(`
          EXEC [dbo].[Message_getMessagesByRequest] @requestId='${requestId}'
        `);
      } else {
        const req = await this.requestService.findOne(requestId);
        if (req && req.CreatedBy === user.Id) {
          result = await getConnection().manager.query(`
            EXEC [dbo].[Message_getMessagesByRequest] @requestId='${requestId}'
        `);
        }
      }
      const response = result.map((val, index) => {
        return {
          Content: val.Content,
          CreatedDate: val.CreatedDate,
          Id: val.Id,
          RequestId: val.RequestId,
          ReplyId: val.CommentId,
          User: {
            FirstName: val.FirstName,
            LastName: val.LastName,
            Email: val.Email,
            Id: val.UserId,
          },
        };
      });
      return response;
    } catch (error) {
      throw new HttpException('Invalid credentials.', HttpStatus.NOT_FOUND);
    }
  }

  async getMessageByMsgId(msgId, user) {
    try {
      const result = await getConnection().manager.query(`
        EXEC [dbo].[Message_getMessageById] @msgId='${msgId}'
      `);
      if (result.length > 0) {
        if (['admin', 'dc-member'].includes(user.role)) {
          return result[0];
        } else {
          const req = await this.requestService.findOne(result[0].RequestId);
          if (req && req.CreatedBy === user.Id) {
            return result[0];
          }
        }
      } else {
        return [];
      }
    } catch (error) {
      throw new HttpException('Invalid credentials.', HttpStatus.NOT_FOUND);
    }
  }
}
