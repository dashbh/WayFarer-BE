import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './user/register.dto';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    const user = await this.authService.validateUser(data.username, data.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @MessagePattern('¸')
  async validateUser(payload: any) {
    return this.authService.validateJWT(payload);
  }

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Body() registerDto: RegisterDto): Promise<User> {
    return this.userService.registerUser(registerDto);
  }
}
