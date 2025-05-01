import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaService } from './kafka.service';
import { KafkaConfigService } from './kafka.config';

@Module({
  imports: [ConfigModule],
  providers: [KafkaService, KafkaConfigService],
  exports: [KafkaService],
})
export class KafkaModule {}
