import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { ServersModule } from 'src/servers/servers.module';
import { MailService } from 'src/mail/mail.service';
import { RequestLogService } from './requestLog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), ServersModule],
  controllers: [RequestsController],
  providers: [RequestsService, MailService, RequestLogService],
  exports: [RequestsService],
})
export class RequestsModule {}
