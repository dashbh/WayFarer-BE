import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseModule } from '@wayfarer/framework';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccommodationEntity,
  AccessoryEntity,
  DestinationEntity,
} from '@wayfarer/common';

import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { SeedController } from './seed/seed.controller';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
    PostgresDatabaseModule,
    TypeOrmModule.forFeature([
      AccessoryEntity,
      DestinationEntity,
      AccommodationEntity,
    ]), // Add your entities here
  ],
  controllers: [CatalogController, SeedController],
  providers: [CatalogService, SeedService],
})
export class CatalogModule {}
