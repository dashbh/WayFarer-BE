import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
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
  async login(@Body() data: { usename: string; password: string }) {
    try {
      return lastValueFrom(this.authService.login(data));
    } catch (error) {
      throw new InternalServerErrorException('Request failed');
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
