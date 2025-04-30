import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaConfigService } from './kafka.config';

@Module({
  imports: [ConfigModule],
  providers: [KafkaService, KafkaConfigService],
  exports: [KafkaService],
})
export class KafkaModule {}
