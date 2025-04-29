import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { KafkaModule } from '@wayfarer/framework';

@Module({
  imports: [KafkaModule],
  controllers: [HealthController],
})
export class HealthModule {}
