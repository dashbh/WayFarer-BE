import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { KafkaService } from '@wayfarer/framework';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    // Subscribe to a Kafka topic called 'auth-topic'
    // await this.kafkaService.subscribe('auth-topic', this.handleMessage);
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
    const payload = { username: user.username };
    await this.kafkaService.publish('auth-topic', [
      { key: 'user', value: user.username },
    ]);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload),
    };
  }

  private handleMessage(message: any) {
    console.log(
      'Received Kafka message in AuthService:',
      message.value.toString(),
    );
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
