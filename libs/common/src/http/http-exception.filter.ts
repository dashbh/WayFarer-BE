import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import { HttpResponse } from './http-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctxType = host.getType();

    if (ctxType === 'http') {
      return this.handleHttpException(exception, host);
    } else if (ctxType === 'rpc') {
      return this.handleRpcException(exception);
    }

    this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
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

  private handleRpcException(exception: any) {
    let message = 'Something went wrong!';
    let errorDetails: any = exception.message;

    if (exception instanceof HttpException) {
      const responseObj = exception.getResponse();
      message = typeof responseObj === 'string' ? responseObj : responseObj['message'] || message;
      errorDetails = responseObj['error'] || errorDetails;
    }

    this.logger.error(`Microservice Exception: ${message}`, exception.stack);
    throw new RpcException(HttpResponse.error(message, errorDetails));
  }
}
