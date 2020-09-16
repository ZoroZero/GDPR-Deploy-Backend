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

  errorlog(id: string, general: string, detail: string, time: string): void{
    
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


    // Data which will write in a file. 
    let data = "Learning how to write in a file."
      
    // Write data in 'Output.txt' . 
    fs.writeFile(`./files/log/errorlog.txt`, data, (err) => { 
      // In case of a error throw err. 
      if (err) throw err; 
    }) 
  }
}