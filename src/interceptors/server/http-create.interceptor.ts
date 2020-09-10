import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EditResponse<T> {
  createAt: T;
//   id?: string;
  statusCode: HttpStatus;
}

@Injectable()
export class CreateInterceptor<T> implements NestInterceptor<T, EditResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<EditResponse<T>> {
    return next.handle().pipe(map(data => ({ createAt: data[0].CreatedDate, statusCode: HttpStatus.OK })));
  }
}