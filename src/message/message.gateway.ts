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

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsJwtGuard)
  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    console.log(payload);
    try {
      this.messageService
        .saveMessage(payload.user, payload.message, payload.requestId)
        .then(result => {
          if (result) {
            const msg = {
              Content: payload.message,
              RequestId: payload.requestId,
              User: payload.user,
              CreatedDate: result.CreatedDate,
              Id: result.Id,
            };
            this.server.emit(payload.requestId, msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
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
