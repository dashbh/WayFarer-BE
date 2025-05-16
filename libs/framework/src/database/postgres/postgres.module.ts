import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { databaseConfig } from './postgres.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService directly
      useFactory: async (configService: ConfigService) =>
        databaseConfig(configService),
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresDatabaseModule {}
