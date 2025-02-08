import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    // return this.authService.login({username: data.username, password: data.password});
    const user = await this.authService.validateUser(data.username);
    if (user && data.password === 'password') { // Simplified for demo
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @MessagePattern('validate_user')
  async validateUser(payload: any) {
    return this.authService.validateUser(payload);
  }
}
