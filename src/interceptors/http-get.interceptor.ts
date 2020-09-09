import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GetResponse<T> {
  data: T;
  statusCode?: HttpStatus;
}

@Injectable()
export class GetInterceptor<T> implements NestInterceptor<T, GetResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<GetResponse<T>> {
    return next.handle().pipe(map(data => ({data})));
  }
}