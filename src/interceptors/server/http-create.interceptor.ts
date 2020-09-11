import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EditResponse<T> {
  status: string,
  createAt: T;
  id: string;
//   id?: string;
  statusCode: HttpStatus;
}

@Injectable()
export class CreateInterceptor<T> implements NestInterceptor<T, EditResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<EditResponse<T>> {
    return next.handle().pipe(map(data => ({ status: 'Successful',  id: data[0].Id, createAt: data[0].CreatedDate, statusCode: HttpStatus.OK })));
  }
}