import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
  imports: [AuthModule, RequestsModule],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
