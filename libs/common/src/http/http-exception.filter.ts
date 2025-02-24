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
import { status as GrpcStatus } from '@grpc/grpc-js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    if (ctx.getResponse<Response>()) {
      this.handleHttpException(exception, host);
    } else {
      this.handleGrpcException(exception, host);
    }
  }

  private handleHttpException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again.';
    let errorDetails: any = exception.message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();
      if (typeof responseObj === 'string') {
        message = responseObj;
      } else if (typeof responseObj === 'object' && responseObj !== null) {
        message = responseObj['message'] || message;
        errorDetails = responseObj['error'] || errorDetails;
      }
    }

    this.logger.error(
      `HTTP Exception: ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: errorDetails,
    });
  }

  private handleGrpcException(exception: any, host: ArgumentsHost) {
    let statusCode = GrpcStatus.UNKNOWN;
    let message = 'Internal gRPC error';

    if (exception instanceof RpcException) {
      const errorResponse = exception.getError();
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse) {
        message = String(errorResponse.message);
      }
    } else if (exception.code !== undefined) {
      // Handle native gRPC errors
      statusCode = exception.code;
      message = exception.details || exception.message;
    }

    this.logger.error(`gRPC Exception: Code ${statusCode} - ${message}`, exception.stack);

    throw Object.assign(new Error(message), { code: statusCode });
  }
}
