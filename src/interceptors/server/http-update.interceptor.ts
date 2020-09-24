import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EditResponse<T> {
  status: string,
  updateAt: T;
  id: string
//   id?: string;
  statusCode: HttpStatus;
}

@Injectable()
export class UpdateInterceptor<T> implements NestInterceptor<T, EditResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<EditResponse<T>> {
    return next.handle().pipe(map(data => ({ status: 'Successful', id: data[0].Id, updateAt: data[0].UpdatedDate, statusCode: HttpStatus.OK })));
  }
}