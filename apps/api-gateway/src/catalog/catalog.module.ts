import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CATALOG_PROTO_PATH } from '@wayfarer/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CATALOG_PACKAGE',
        imports: [ConfigModule], // Ensure ConfigModule is available
        inject: [ConfigService], // Inject ConfigService
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>(
            'CATALOG_GRPC_HOST',
            'localhost',
          );
          const port = configService.get<number>('CATALOG_SERVICE_PORT', 9002);
          return {
            transport: Transport.GRPC,
            options: {
              package: 'wayfarer.catalog',
              protoPath: CATALOG_PROTO_PATH,
              url: `${host}:${port}`,
            },
          };
        },
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [],
})
export class CatalogModule {}
