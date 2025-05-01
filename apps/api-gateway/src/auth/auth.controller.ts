import {
  Controller,
  Post,
  Body,
  Res,
  Inject,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

interface AuthGrpcService {
  login(data: {
    usename: string;
    password: string;
  }): Observable<{ accessToken: string; refreshToken: string }>;
  registerUser(data: {
    usename: string;
    password: string;
  }): Observable<{ userId: string; message: string }>;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthGrpcService;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthGrpcService>('AuthGrpcService');
    if (!this.authService || !this.authService.login) {
      throw new InternalServerErrorException(
        'AuthGrpcService not initialized properly',
      );
    }
  }

  @Post('login')
  async login(
    @Body() data: { usename: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const loginResult = await lastValueFrom(this.authService.login(data));

      const token = loginResult?.accessToken;

      if (!token) {
        throw new InternalServerErrorException('No token received');
      }

      // Set cookie
      response.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
      });

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Login failed');
    }
  }

  @Post('register')
  async register(@Body() data: { usename: string; password: string }) {
    try {
      return lastValueFrom(this.authService.registerUser(data));
    } catch (error) {
      throw new InternalServerErrorException('Request failed');
    }
  }
}
