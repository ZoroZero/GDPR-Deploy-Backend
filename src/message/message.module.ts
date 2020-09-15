import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [MessageGateway],
})
export class MessageModule {}
