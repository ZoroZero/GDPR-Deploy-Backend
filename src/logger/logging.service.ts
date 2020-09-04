import { Injectable, Logger, Scope, ParseUUIDPipe } from '@nestjs/common'
import { ErrorLog } from './error-log.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends Logger {
  constructor(
    @InjectRepository(ErrorLog)private errorRepository: Repository<ErrorLog>
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

  errorlog(id: string, detail: string, general: string): void{
    this.errorRepository.insert({CreatedBy: id,CreatedDate: new Date(), Detail: detail, General: general});
    this.error(id, detail, general);
  }
}