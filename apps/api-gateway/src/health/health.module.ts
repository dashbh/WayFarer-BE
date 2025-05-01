import { Module } from '@nestjs/common';
import { KafkaModule } from '@wayfarer/framework';

import { HealthController } from './health.controller';

@Module({
  imports: [KafkaModule],
  controllers: [HealthController],
})
export class HealthModule {}
