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

  async getAllActiveServer(){
    return await this.serversRepository.query(`
      EXECUTE [dbo].[ServerGetActiveServerList] 
    `)
  }

  async getIdFromIpAndName(serverIp: string, serverName: string){
    return await this.serversRepository.findOne({IpAddress: serverIp, Name: serverName})
  }

  async addNewServer(_server: CreateServerDto, _userId: string) {
    // return await this.serversRepository.save(_server);
    return this.serversRepository.query(`EXECUTE dbo.[ServerAlter]
      @ServerName='${_server.serverName}',  
      @ServerIp= '${_server.ipAddress}',  
      @StartDate= '${_server.startDate}', 
      @EndDate= '${_server.endDate}', 
      @CreatedBy= '${_userId}', 
    `)
  }

  async updateServer(_server: Server, _userId: string){
    return this.serversRepository.query(`EXECUTE dbo.[ServerAlter]
      @ServerId = '${_server.Id}',
      @ServerName='${_server.Name}',  
      @ServerIp= '${_server.IpAddress}',  
      @StartDate= '${_server.StartDate}', 
      @EndDate= '${_server.EndDate}', 
      @UpdatedBy= '${_userId}',
      @IsActive= ${_server.IsActive}
    `)
  }
}