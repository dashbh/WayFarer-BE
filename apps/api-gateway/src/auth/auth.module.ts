import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

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
            'AUTH_SERVICE_HOST',
            'localhost',
          );
          const port = configService.get<number>('AUTH_SERVICE_PORT', 9001);
          return {
            transport: Transport.GRPC,
            options: {
              package: 'wayfarer.auth',
              protoPath: join(
                process.cwd(),
                'apps/api-gateway/src/proto/auth.proto',
              ),
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
