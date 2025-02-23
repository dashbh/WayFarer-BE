import { Body, Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { HttpResponse, RegisterDto, UserEntity } from '@wayfarer/common';
import { status } from '@grpc/grpc-js';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @GrpcMethod('wayfarer.auth.AuthGrpcService', 'Login')
  async login(data: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      data.username,
      data.password,
    );

    if (!user) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
      // throw new RpcException(HttpResponse.error('Invalid credentials', 'Unauthorized', status.UNAUTHENTICATED));
    }

    if (user) {
      return this.authService.login(user);
    }
  }

  @GrpcMethod('wayfarer.auth.AuthGrpcService', 'ValidateUser')
  async validateUser(payload: any) {
    return this.authService.validateJWT(payload);
  }

  @GrpcMethod('AuthGrpcService', 'RegisterUser')
  async registerUser(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.userService.registerUser(registerDto);
  }
}
