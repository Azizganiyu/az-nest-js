import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class SizeLimitInterceptor implements NestInterceptor {
  private sizeLimit = 0;

  constructor(sizeLimit: number) {
    this.sizeLimit = sizeLimit;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const size = request.socket.bytesRead;
    if (size > this.sizeLimit) {
      throw new BadRequestException('File upload Too Large');
    }

    if (request.body) {
      for (const key in request.body) {
        if (typeof request.body[key] == 'string') {
          request.body[key] = request.body[key].trim();
          if (request.body[key].length == 0) {
            request.body[key] = null;
          }
        }
      }
    }

    //response.status = false;
    return next.handle().pipe(
      map((data) => {
        if (data?.status && data?.message && !data?.data) {
          return {
            status: data.status,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data.message,
          };
        }
        if (data?.status && data?.message && data?.data) {
          return {
            status: data.status,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data.message,
            data: data.data,
          };
        }
        return data;
      }),
    );
  }
}
