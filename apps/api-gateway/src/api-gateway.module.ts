import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiGatewayService } from './api-gateway.service';
import { CatalogGatewayController } from './catalog/catalog-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    ClientsModule.registerAsync([ // registerAsyc used to make config module available in this context
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule], // Ensure ConfigModule is available
        inject: [ConfigService], // Inject ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('AUTH_SERVICE_PORT', 3001),
          },
        }),
      },
      {
        name: 'CATALOG_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('CATALOG_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('CATALOG_SERVICE_PORT', 3002),
          },
        }),
      },
    ]),
  ],
  controllers: [ApiGatewayController, CatalogGatewayController],
  providers: [ApiGatewayService],
})

export class ApiGatewayModule { }
