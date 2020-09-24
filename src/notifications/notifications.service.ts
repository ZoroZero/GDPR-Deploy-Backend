import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { RequestsService } from 'src/requests/requests.service';
import { getConnection } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(private readonly requestsService: RequestsService) {}

  async findAll(User): Promise<any> {
    return await getConnection().manager.query(`
            EXEC [dbo].[Notification_getAllNotification] @UserId='${User.UserId}'
        `);
  }
  async saveNotification(Content: String, RequestId, User): Promise<any> {
    try {
      const req = await this.requestsService.findOne(RequestId);
      const lstAdminDc = await getConnection().manager.query(`
      EXEC [dbo].[Request_getListEmailAdminDcmember]
    `);
      const lstIdAdminDc = lstAdminDc.map((val, index) => {
        return val.Id;
      });
      const user = await getConnection().manager.query(`
      EXEC [dbo].[getInfoFromId]
      @Id='${User.Id}'
    `);
      if (['admin', 'dc-member'].includes(user[0].RoleName)) {
      } else {
        lstIdAdminDc.push(User.Id);
      }
      return await getConnection().manager.query(`
      EXEC [dbo].[Notification_createNotification]
      @Content='${Content}',
      @Link='${`/request-management/${RequestId}`}',
      @RequestId='${RequestId}',
      @LstUserId='${lstIdAdminDc.join(',')}'
    `);
    } catch (error) {}
  }

  async setNotificationIsRead(notifId, user): Promise<any> {
    return await getConnection().manager.query(`
        EXEC [dbo].[Notification_setReadNotification]
        @NotifId='${notifId}',
        @UserId='${user.UserId}'
      `);
  }
}
