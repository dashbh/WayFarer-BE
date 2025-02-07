import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern({ cmd: 'login' })
  login(data: { username: string; password: string }) {
    return this.authService.login({username: data.username, password: data.password});
  }
}
