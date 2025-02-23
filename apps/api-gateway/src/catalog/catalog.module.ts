import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      // registerAsyc used to make config module available in this context
      {
        name: 'CATALOG_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>(
              'CATALOG_SERVICE_HOST',
              'localhost',
            ),
            port: configService.get<number>('CATALOG_SERVICE_PORT', 9002),
          },
        }),
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [],
})
export class CatalogModule {}
