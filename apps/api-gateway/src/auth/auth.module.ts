import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_PROTO_PATH } from '@wayfarer/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      // registerAsyc used to make config module available in this context
      {
        name: 'AUTH_PACKAGE',
        imports: [ConfigModule], // Ensure ConfigModule is available
        inject: [ConfigService], // Inject ConfigService
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>(
            'AUTH_GRPC_HOST',
            'localhost',
          );
          const port = configService.get<number>('AUTH_SERVICE_PORT', 9001);
          return {
            transport: Transport.GRPC,
            options: {
              package: 'wayfarer.auth',
              protoPath: AUTH_PROTO_PATH,
              url: `${host}:${port}`,
            },
          };
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
