import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@wayfarer/framework';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogItemEntity } from '@wayfarer/common';

import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
    DatabaseModule,
    TypeOrmModule.forFeature([CatalogItemEntity]), // Add your entities here
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
