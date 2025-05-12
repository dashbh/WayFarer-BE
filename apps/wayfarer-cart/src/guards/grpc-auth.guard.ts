import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = context.switchToRpc().getContext(); // This is the metadata object
    const authHeaders = metadata.get('authorization') as string[] | undefined;
    const authHeader = authHeaders?.[0];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Attach the user payload to the metadata for later use
      metadata.add('user', JSON.stringify(payload));
      return true;
    } catch (err) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: `Invalid or expired token`,
        error: err,
      });
    }
  }
}
