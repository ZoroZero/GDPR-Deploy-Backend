import { Injectable, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { CreateServerDto } from './create-server-post.dto';
// export type User = any;

@Injectable()
export class ServersService {

  constructor(
    @InjectRepository(Server) private serversRepository: Repository<Server>,
  ) {}

  async listAllServer(): Promise<Server[]> {
    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] `);
  }

  async getServerByPage(current: number, pageSize: number){
    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] @PageNumber =${current}, @PageSize=${pageSize}`);
  }

  async addNewServer(_server: CreateServerDto) {
    // return await this.serversRepository.save(_server);
    return this.serversRepository.query(`EXECUTE dbo.[ServerAlter]
      @ServerName='${_server.serverName}',  
      @ServerIp= '${_server.ipAddress}',  
      @StartDate= '${_server.startDate}', 
      @EndDate= '${_server.endDate}', 
      @CreatedBy= '${_server.createdBy}', 
      @CreatedDate= '2020-08-20'`)
  }
}
