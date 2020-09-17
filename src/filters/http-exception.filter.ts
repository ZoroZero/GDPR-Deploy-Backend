import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from 'src/logger/logging.service';
import { getConnection } from 'typeorm';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const user = request.user;
    const timestamp = new Date().toISOString()
    
    
    if(user){
      new LoggingService().errDBLog(user['UserId'], String(status), request.url, timestamp)
      
    }
    new LoggingService().errorFileLog(`[${timestamp}]   [${status}]   [${request.url}]      ${exception}`)
    
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: timestamp,
        path: request.url,
        exception: exception
      });
  }
}