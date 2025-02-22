import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from './http-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.handleHttpException(exception, host);
  }

  private handleHttpException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorDetails: any = exception.message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();
      if (typeof responseObj === 'string') {
        message = responseObj;
      } else if (typeof responseObj === 'object') {
        message = responseObj['message'] || message;
        errorDetails = responseObj['error'] || errorDetails;
      }
    }

    this.logger.error(`HTTP Exception: ${status} - ${message}`, exception.stack);
    response.status(status).json(HttpResponse.error(message, errorDetails, status));
  }
}
