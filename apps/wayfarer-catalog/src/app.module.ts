import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CatalogModule } from './catalog/catalog.module';
import { DestinationModule } from './destination/destination.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CatalogModule,
    DestinationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
