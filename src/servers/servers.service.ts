import {
  Injectable,
  HttpException,
  HttpStatus,
  UseGuards,
  Inject,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server-post.dto';
import { SearchDataDto } from '../dto/search.dto';
import { ExportDto } from './dto/export-server.dto';
import { ChangeStatusListServerDto } from './dto/change-status-list-server.dto';
import { ImportServerDto } from './dto/import-server-list.dto';
import { query, request } from 'express';
import { LoggingService } from 'src/logger/logging.service';
import { EditServerDto } from './dto/edit-server.dto';
// const csv = require('csv-parser');
const LogServer = new LoggingService();
@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server) private serversRepository: Repository<Server>,
  ) {}

  async listAllServer(): Promise<Server[]> {
    return await this.serversRepository.find({ IsDeleted: false });
  }

  async checkServerStatus(serverId) {
    const server = await this.serversRepository.findOne({
      Id: serverId,
      IsActive: true,
      IsDeleted: false,
    });
    return server !== null;
  }

  async getServerByPage(params: SearchDataDto) {
    console.log(
      'Query ',
      `EXEC [dbo].[ServerGetServerList] 
    @PageNumber =${params.pageNumber}, @PageSize=${params.pageSize}, 
    @SortColumn='${params.sortColumn}', @SortOrder = '${params.sortOrder}', 
    @KeyWord = '${params.keyword}',
    @@FilterList = '${params.filterKeys}',
    @FilterColumn= '${params.filterColumn}'`,
    );

    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] 
      @PageNumber =${params.pageNumber}, @PageSize=${params.pageSize}, 
      @SortColumn='${params.sortColumn}', @SortOrder = '${params.sortOrder}', 
      @KeyWord = '${params.keyword}',
      @FilterList = '${params.filterKeys}',
      @FilterColumn= '${params.filterColumn}'`);
  }

  async getAllActiveServer() {
    return await this.serversRepository.query(`
      EXECUTE [dbo].[ServerGetActiveServerList] 
    `);
  }

  async getIdFromIpAndName(serverIp: string, serverName: string) {
    return await this.serversRepository.findOne({
      IpAddress: serverIp,
      Name: serverName,
    });
  }

  async addNewServer(_server: CreateServerDto, _userId: string) {
    // return await this.serversRepository.save(_server);
    return this.serversRepository.query(`
    SET DATEFORMAT dmy
    EXECUTE dbo.[ServerAlter]
      @ServerName='${_server.serverName}',  
      @ServerIp= '${_server.ipAddress}',  
      @StartDate= '${_server.startDate}', 
      @EndDate= '${_server.endDate}', 
      @CreatedBy= '${_userId}'
    `);
  }

  async updateServer(_server: EditServerDto, _userId: string) {
    return this.serversRepository
      .query(
        `
    SET DATEFORMAT dmy
    EXECUTE dbo.[ServerAlter]
      @ServerId = '${_server.Id}',
      @ServerName='${_server.Name}',  
      @ServerIp= '${_server.IpAddress}',  
      @StartDate= '${_server.StartDate}', 
      @EndDate= '${_server.EndDate}', 
      @UpdatedBy= '${_userId}',
      @IsActive= ${_server.IsActive}
    `,
      )
      .then(res => {
        LogServer.logFile(process.env.SERVER_FOLDER,
          `[${_userId}]     [${_server.Id}]     [Update server]     [${res[0].UpdatedDate}]`,
          process.env.SERVER_LOG_FILE,
        );
        return res;
      });
  }

  async updateMultiServer(
    _request: ChangeStatusListServerDto,
    _userId: string,
  ) {
    return await this.serversRepository
      .query(`EXECUTE [dbo].[ServerAlterServerListStatus] 
      @ServerIdList = '${_request.listServer.join(',')}'
     ,@UpdatedBy = '${_userId}'
     ,@IsActive = ${_request.status}`);
  }

  async deleteServerWithId(_id: string, _userId: string) {
    return this.serversRepository
      .query(
        `EXECUTE dbo.[ServerDeleteServer]
    @ServerId = '${_id}'
    ,@UpdatedBy = '${_userId}'
    ,@DeletedBy = '${_userId}'
  `,
      )
      .then(res => {
        LogServer.logFile(process.env.SERVER_FOLDER,
          `[${_userId}]     [${_id}]      [Delete server]     [${res[0].UpdatedDate}]`,
          process.env.SERVER_LOG_FILE,
        );
        return res;
      });
  }

  async deleteMultiServer(_idList: string, _userId: string) {
    var idList = _idList.split(',');

    return await Promise.all([
      idList.forEach((id: string) => {
        this.serversRepository.query(
          `EXECUTE dbo.[ServerDeleteServer]
        @ServerId = '${id}'
        ,@UpdatedBy = '${_userId}'
        ,@DeletedBy = '${_userId}'
        `,
        );
      }),
    ]);
  }

  async exportServerList(_request: ExportDto) {
    console.log(_request);
    return await this.serversRepository.query(
      `
    EXECUTE [dbo].[ServerExportServerList] 
      @ServerName = ${_request.serverName? `'${_request.serverName}'` : `''`} 
     ,@ServerIpList =  ${_request.serverIpList? `'${_request.serverIpList.join(',')}'` : null}
     ,@FromDate = ${_request.startDate? `'${_request.startDate}'`: null}
     ,@ToDate = ${_request.endDate? `'${_request.endDate}'`: null}
     ,@FilterList = '${_request.filterKeys}',
     @FilterColumn = '${_request.filterColumn}'`

    )
  }

  async importServerList(request: ImportServerDto){
    return this.serversRepository.save(request.listServer)
  }


  async recoverServerWithId(_id: string, _userId: string){
    return this.serversRepository.query(`EXECUTE dbo.[ServerRecoverServer]
    @ServerId = '${_id}'
    ,@UpdatedBy = '${_userId}'
    `).then(res => {
      LogServer.logFile(process.env.SERVER_FOLDER,`[${_userId}]     [${_id}]      [Recover server]     [${res[0].UpdatedDate}]`,
      process.env.SERVER_LOG_FILE)
      return res;
    })
  }
}
