import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
} from '@nestjs/common';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import axios, { AxiosRequestConfig } from 'axios';
import { Request, Response } from 'express';

@Injectable()
export class ForwardInterceptor implements NestInterceptor {
  constructor(
    private envKey: string, // Tên key trong env, ví dụ 'SONG_SERVICE_URL'
    private pathTemplate: string,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Lấy baseUrl từ env dựa vào key truyền vào constructor
    const baseUrl = process.env[this.envKey];
    if (!baseUrl) {
      throw new BadGatewayException(`Missing env config for ${this.envKey}`);
    }

    // Build target URL by replacing :params in pathTemplate with req.params
    let path = this.pathTemplate;
    for (const [key, value] of Object.entries(req.params)) {
      path = path.replace(`:${key}`, encodeURIComponent(value));
    }
    const targetUrl = `${baseUrl}${path}`;

    const axiosConfig: AxiosRequestConfig = {
      url: targetUrl,
      method: req.method as any,
      headers: { ...req.headers },
      params: req.query,
      data: req.body,
      validateStatus: () => true,
    };

    return from(axios.request(axiosConfig)).pipe(
      mergeMap((axiosRes) => {
        res.status(axiosRes.status);

        for (const [key, value] of Object.entries(axiosRes.headers)) {
          if (
            ![
              'content-encoding',
              'transfer-encoding',
              'content-length',
              'connection',
            ].includes(key.toLowerCase())
          ) {
            res.setHeader(key, value as string);
          }
        }

        res.send(axiosRes.data);

        // Trả về observable có giá trị null để tránh lỗi no elements in sequence
        return of(null);
      }),
      catchError((err) => {
        return throwError(
          () => new BadGatewayException(err.message || 'Bad Gateway'),
        );
      }),
    );
  }
}
