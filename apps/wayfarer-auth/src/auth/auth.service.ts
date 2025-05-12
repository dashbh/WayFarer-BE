import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { KafkaService } from '@wayfarer/framework';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    // Subscribe to a Kafka topic called 'user.login'
    await this.kafkaService.subscribe('user.login', this.handleMessage);
  }

  async validateUser(username: string, password: string): Promise<any> {
    // First Check -> Valid User
    const user = await this.userService.findByUserName(username);
    if (!user) return null;

    // Second Check -> Valid pwd
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const result = { ...user };
    delete result.password;
    // Exclude password
    return result;
  }

  async login(user: any) {
    // Mock user database (Replace with real DB)
    const users = [
      {
        id: '123456',
        email: 'user@example.com',
        name: 'Bhabani Prasad',
        image: 'https://gravatar.com/images/homepage/avatar-01.png',
      },
    ];

    const payload = { username: user.username, ...users[0] };
    this.kafkaService.publish('user.login', [
      {
        key: user.username,
        value: JSON.stringify({
          ...payload,
          timestamp: Date.now(),
        }),
      },
    ]);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload),
    };
  }

  private handleMessage(message: any) {
    console.log('Received Kafka message in AuthService ->', message);
    // You can do any processing here with the received message
  }

  async validateJWT(payload: any) {
    const user = await this.userService.findByUserName(payload.username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
