import { Injectable, Logger, Scope, ParseUUIDPipe } from '@nestjs/common'
import { HttpException, HttpStatus } from '@nestjs/common';
import { getConnection } from 'typeorm';
const fs = require('fs') 

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends Logger {
  constructor(
  ) {
    super()
  }

  error(message: string, trace?: string, context?: string): void {
    // TO DO
    super.error(message, trace, context)
  }

  warn(message: string, context?: string): void {
    // TO DO
    super.warn(message, context)
  }

  log(message: string, context?: string): void {
    // TO DO
    super.log(message, context)
  }

  debug(message: string, context?: string): void {
    // TO DO
    super.debug(message, context)
  }

  verbose(message: string, context?: string): void {
    // TO DO
    super.verbose(message, context)
  }

  errDBLog(id: string, general: string, detail: string, time: string): void{
    
    getConnection()
      .manager.query(
        `EXECUTE [dbo].[ErrorLogError] 
          @UserId = '${id}'
          ,@Status = '${general}'
          ,@Detail = '${detail}'
          ,@Date = '${time}'
      `
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });


   
  }

  errorFileLog(message: string){
    // Data which will write in a file. 
    fs.appendFile('./files/log/errorlog.txt', `\n${message}`, (err) => {
      if (err) throw err;
      console.log('The error log were updated!');
    });
  }


  logFile(message:string, filename: string){
    // Data which will write in a file. 
    fs.appendFile(filename, `\n${message}`, (err) => {
      if (err) throw err;
      console.log(`The ${filename} were updated!`);
    });
  }
}