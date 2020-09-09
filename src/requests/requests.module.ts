import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { ServersService } from 'src/servers/servers.service';
import { ServersModule } from 'src/servers/servers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), ServersModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
