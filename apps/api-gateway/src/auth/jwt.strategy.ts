import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private authClient: ClientProxy;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // console.log('Extracting JWT from request', req?.cookies);
          return req?.cookies?.auth_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    // Connect to the Auth Microservice
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('AUTH_SERVICE_HOST', 'localhost'),
        port: this.configService.get<number>('AUTH_SERVICE_PORT', 9001),
      },
    });
  }

  async validate(payload: any) {
    return this.authClient.send('validate_user', payload);
  }
}
