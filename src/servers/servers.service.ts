import { Injectable, HttpException, HttpStatus, UseGuards, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { CreateServerDto } from './create-server-post.dto';
import { SearchDataDto } from '../dto/search.dto';

@Injectable()
export class ServersService {

  constructor(
    @InjectRepository(Server) private serversRepository: Repository<Server>
  ) {}

  async listAllServer(): Promise<Server[]> {
    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] `);
  }

  async getServerByPage(params: SearchDataDto){
    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] @PageNumber =${params.pageNumber}, @PageSize=${params.pageSize}, 
                                              @SortColumn='${params.sortColumn}', @SortOrder = '${params.sortOrder}', @KeyWord = '${params.keyword}'`);
  }

  async addNewServer(_server: CreateServerDto, _userId: string) {
    // return await this.serversRepository.save(_server);
    return this.serversRepository.query(`EXECUTE dbo.[ServerAlter]
      @ServerName='${_server.serverName}',  
      @ServerIp= '${_server.ipAddress}',  
      @StartDate= '${_server.startDate}', 
      @EndDate= '${_server.endDate}', 
      @CreatedBy= '${_userId}', 
      @CreatedDate= '2020-08-20'`)
  }
}
