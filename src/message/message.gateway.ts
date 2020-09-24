import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/jwt-socket-auth.guard';
import { MessageService } from './message.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { getConnection } from 'typeorm';
import { RequestsService } from 'src/requests/requests.service';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly notificationsService: NotificationsService,
    private readonly requestsService: RequestsService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsJwtGuard)
  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: any): Promise<any> {
    try {
      this.messageService
        .saveMessage(
          payload.user,
          payload.message,
          payload.requestId,
          payload.ReplyId,
        )
        .then(result => {
          if (result) {
            const msg = {
              Content: payload.message,
              RequestId: payload.requestId,
              User: payload.user,
              Avatar: payload.avatar,
              CreatedDate: result.CreatedDate,
              ReplyId: payload.ReplyId,
              ReplyMsg: payload.ReplyMsg,
              Id: result.Id,
            };
            this.server.to(payload.requestId).emit(payload.requestId, msg);
          }
        });
      const req = await this.requestsService.findOne(payload.requestId);
      this.notificationsService
        .saveNotification(
          `You have new message in request ${req.Number}`,
          payload.requestId,
          payload.user,
        )
        .then(async result => {
          const lstAdminDc = await getConnection().manager.query(`
            EXEC [dbo].[Request_getListEmailAdminDcmember]
          `);
          const lstIdAdminDc = lstAdminDc.map((val, index) => {
            return val.Id;
          });
          if (!lstIdAdminDc.includes(req.CreatedBy)) {
            lstIdAdminDc.push(req.CreatedBy);
          }

          for (let i in lstIdAdminDc) {
            this.server.emit(lstIdAdminDc[i], result[0]);
          }
        });
    } catch (error) {}
  }

  @UseGuards(WsJwtGuard)
  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: any): void {
    client.join(payload.requestId);
    this.logger.log(`Client ${client.id} join room`);
  }

  @UseGuards(WsJwtGuard)
  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, payload: any): void {
    client.leave(payload.requestId);
    this.logger.log(`Client ${client.id} leave room`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
