import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      // registerAsyc used to make config module available in this context
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule], // Ensure ConfigModule is available
        inject: [ConfigService], // Inject ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('AUTH_SERVICE_PORT', 9001),
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
