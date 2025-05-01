import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { status as GrpcStatus } from '@grpc/grpc-js';

import { HttpResponse } from './http-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again.';
    let errorCode: string | number = 'INTERNAL_ERROR';
    let details: any = null;

    // Handle raw gRPC errors
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      'details' in exception
    ) {
      this.logger.warn(
        `🟠 Raw gRPC Error Received: ${JSON.stringify(exception)}`,
      );

      message = exception.details || message;
      errorCode = exception.code || GrpcStatus.UNKNOWN;
      details = exception;

      status = this.mapGrpcToHttpStatus(exception.code);
    }
    // Handle gRPC RpcException
    else if (exception instanceof RpcException) {
      this.logger.warn(
        `🟡 RpcException Received: ${JSON.stringify(exception.getError())}`,
      );

      const grpcError = exception.getError();
      if (typeof grpcError === 'object' && grpcError !== null) {
        message = grpcError['message'] || message;
        errorCode = grpcError['code'] || GrpcStatus.UNKNOWN;
        details = grpcError;
      }

      status = this.mapGrpcToHttpStatus(
        grpcError['code'] || GrpcStatus.UNKNOWN,
      );
    }
    // Handle NestJS HTTP exceptions
    else if (exception instanceof HttpException) {
      this.logger.warn(
        `🟢 HttpException Received: ${JSON.stringify(exception.getResponse())}`,
      );

      status = exception.getStatus();
      const responseObj = exception.getResponse();

      if (typeof responseObj === 'object') {
        message = responseObj['message'] || message;
        errorCode = responseObj['error'] || errorCode;
        details = responseObj;
      }
    }

    this.logger.error(
      `❌ HTTP Exception: ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      errorCode, // Standardized error code
      message,
      details, // Full error details for debugging
    });
  }

  /**
   * Maps gRPC error codes to appropriate HTTP status codes
   */
  private mapGrpcToHttpStatus(grpcCode: number): number {
    const grpcToHttpMap: Record<number, number> = {
      [GrpcStatus.OK]: HttpStatus.OK,
      [GrpcStatus.CANCELLED]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
      [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
      [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
      [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
      [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
      [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
      [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
      [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
      [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
      [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
      [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
      [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return grpcToHttpMap[grpcCode] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
