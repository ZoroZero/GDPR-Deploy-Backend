import { Injectable, HttpException, HttpStatus, UseGuards, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { CreateServerDto } from './dto/create-server-post.dto';
import { SearchDataDto } from '../dto/search.dto';
import { ExportDto } from './dto/export-server.dto';
import * as XLSX from 'xlsx';
import { ChangeStatusListServerDto } from './dto/change-status-list-server.dto';
const fs = require('fs')
// const csv = require('csv-parser');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const csv=require('csvtojson')

@Injectable()
export class ServersService {

  constructor(
    @InjectRepository(Server) private serversRepository: Repository<Server>
  ) {}

  async listAllServer(): Promise<Server[]> {
    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] `);
  }

  async getServerByPage(params: SearchDataDto){
    console.log("Query ", `EXEC [dbo].[ServerGetServerList] 
    @PageNumber =${params.pageNumber}, @PageSize=${params.pageSize}, 
    @SortColumn='${params.sortColumn}', @SortOrder = '${params.sortOrder}', 
    @KeyWord = '${params.keyword}',
    @@FilterList = '${params.filterKeys}',
    @FilterColumn= '${params.filterColumn}'`);
    
    return await this.serversRepository.query(`EXEC [dbo].[ServerGetServerList] 
      @PageNumber =${params.pageNumber}, @PageSize=${params.pageSize}, 
      @SortColumn='${params.sortColumn}', @SortOrder = '${params.sortOrder}', 
      @KeyWord = '${params.keyword}',
      @FilterList = '${params.filterKeys}',
      @FilterColumn= '${params.filterColumn}'`);
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
    return this.serversRepository.query(`
    SET DATEFORMAT dmy
    EXECUTE dbo.[ServerAlter]
      @ServerName='${_server.serverName}',  
      @ServerIp= '${_server.ipAddress}',  
      @StartDate= '${_server.startDate}', 
      @EndDate= '${_server.endDate}', 
      @CreatedBy= '${_userId}'
    `)
  }

  async updateServer(_server: Server, _userId: string){
    return this.serversRepository.query(`
    SET DATEFORMAT dmy
    EXECUTE dbo.[ServerAlter]
      @ServerId = '${_server.Id}',
      @ServerName='${_server.Name}',  
      @ServerIp= '${_server.IpAddress}',  
      @StartDate= '${_server.StartDate}', 
      @EndDate= '${_server.EndDate}', 
      @UpdatedBy= '${_userId}',
      @IsActive= ${_server.IsActive}
    `)
  }

  async updateMultiServer(_request: ChangeStatusListServerDto, _userId: string){
      return await Promise.all([
        _request.listServer.forEach((server:Server) => {
          this.serversRepository.query(`SET DATEFORMAT dmy
          EXECUTE dbo.[ServerAlter]
          @ServerId = '${server.Id}',
          @ServerName='${server.Name}',  
          @ServerIp= '${server.IpAddress}',  
          @StartDate= '${server.StartDate}', 
          @EndDate= '${server.EndDate}', 
          @UpdatedBy= '${_userId}',
          @IsActive= ${_request.status}
          `)})
      ])
  }

  async deleteServerWithId(_id: string, _userId: string){
    return this.serversRepository.query(
    `EXECUTE dbo.[ServerDeleteServer]
    @ServerId = '${_id}'
    ,@UpdatedBy = '${_userId}'
    ,@DeletedBy = '${_userId}'
  `)
  }


  async exportServerList(_request: ExportDto){
    console.log(_request);
    return await this.serversRepository.query(
    `SET DATEFORMAT dmy
    EXECUTE [dbo].[ServerExportServerList] 
      @ServerName = ${_request.serverName? `'${_request.serverName}'` : `''`} 
     ,@ServerIp =  ${_request.serverIp? `'${_request.serverIp}'` : `''`}
     ,@FromDate = ${_request.startDate? `'${_request.startDate}'`: null}
     ,@ToDate = ${_request.endDate? `'${_request.endDate}'`: null}`
    )
  }


  async importFile(file){
    if(file.includes('.csv')){
      const converter=csv().fromFile(process.env.SERVER_FOLDER+ `/${file}`)
      .then( async (json) =>{
        console.log(json);
        return await Promise.all([
          json.forEach((data:Server) => {
          this.serversRepository.query(`SET DATEFORMAT dmy
          EXECUTE dbo.[ServerAlter]
            @ServerId = '${data.Id}'
            ,@ServerName = '${data.Name}'
            ,@ServerIp = '${data.IpAddress}'
            ,@StartDate = '${data.StartDate}'
            ,@EndDate = '${data.EndDate}'
            ,@CreatedDate = '${data.CreatedDate}'
            ,@CreatedBy = '${data.CreatedBy}'
            ,@UpdatedDate = ${data.UpdatedDate? `'${data.UpdatedDate}'`: null}
            ,@UpdatedBy = ${data.UpdatedBy? `'${data.UpdatedBy}'`: null}
            ,@DeletedDate = ${data.DeletedDate? `'${data.DeletedDate}'`: null}
            ,@DeletedBy = ${data.DeletedBy? `'${data.DeletedBy}'`: null}
            ,@IsDeleted = ${data.IsDeleted?1:0}
            ,@IsActive = ${data.IsActive?1:0}` 
          )})
        ])
        .then(res => {
          return unlinkAsync(process.env.SERVER_FOLDER+ `/${file}`)
          .then(res => {
            return  {sucessful: true, status: HttpStatus.OK}
          }).
          catch(err => {console.log(err);
          })
        })
        .catch(err => {
            throw new HttpException("Failed", HttpStatus.BAD_REQUEST)
          })
       });
    }
    else{
      var workbook = XLSX.readFile(process.env.SERVER_FOLDER+ `/${file}`);
      var sheet_name_list = workbook.SheetNames;
      // console.log(XLSX.utils.sheet_to_txt(workbook.Sheets[sheet_name_list[0]]));
      var importData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        // console.log(xlData[0])
      return await Promise.all([importData.forEach((data:Server) => {
        this.serversRepository.query(`SET DATEFORMAT dmy
        EXECUTE dbo.[ServerAlter]
          @ServerId = '${data.Id}'
          ,@ServerName = '${data.Name}'
          ,@ServerIp = '${data.IpAddress}'
          ,@StartDate = '${data.StartDate}'
          ,@EndDate = '${data.EndDate}'
          ,@CreatedDate = '${data.CreatedDate}'
          ,@CreatedBy = '${data.CreatedBy}'
          ,@UpdatedDate = ${data.UpdatedDate? `'${data.UpdatedDate}'`: null}
          ,@UpdatedBy = ${data.UpdatedBy? `'${data.UpdatedBy}'`: null}
          ,@DeletedDate = ${data.DeletedDate? `'${data.DeletedDate}'`: null}
          ,@DeletedBy = ${data.DeletedBy? `'${data.DeletedBy}'`: null}
          ,@IsDeleted = ${data.IsDeleted?1:0}
          ,@IsActive = ${data.IsActive?1:0}` 
        )})
      ])
      .then(res => {
        return unlinkAsync(process.env.SERVER_FOLDER+ `/${file}`)
        .then(res => {
          return  {sucessful: true, status: HttpStatus.OK}
        }).
        catch(err => {console.log(err);
        })
      })
      .catch(err => {
          throw new HttpException("Failed", HttpStatus.BAD_REQUEST)
      })
    }
  }
}
