import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // First Check -> Valid User
    const user = await this.userService.findByUserName(username);
    if (!user) return null;

    // Second Check -> Valid pwd
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...result } = user; // Exclude password
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateJWT(payload: any) {
    console.log('payload', payload)
    const user = await this.userService.findByUserName(payload.username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
