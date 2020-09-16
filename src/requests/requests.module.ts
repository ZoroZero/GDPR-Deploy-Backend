import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { ServersService } from 'src/servers/servers.service';
import { ServersModule } from 'src/servers/servers.module';
import { MailService } from 'src/mail/mail.service';
import { RequestLogService } from './requestLog.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), ServersModule],
  controllers: [RequestsController],
  providers: [RequestsService, MailService, RequestLogService],
})
export class RequestsModule {}
