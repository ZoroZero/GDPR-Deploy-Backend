import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GetResponse<T> {
  total: Int16Array,
  data: T;
  statusCode?: HttpStatus;
}

@Injectable()
export class GetInterceptor<T> implements NestInterceptor<T, GetResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<GetResponse<T>> {
    console.log(next);
    
    return next.handle().pipe(map(data => ({ total: data[0]?data[0].Total: 0, data: data})));
  }
}