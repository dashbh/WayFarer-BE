import { Controller, Get } from '@nestjs/common';
import { KafkaService } from '@wayfarer/framework';

@Controller('health')
export class HealthController {
  constructor(private kafkaService: KafkaService) {}
  @Get()
  async check() {
    this.kafkaService.publish('wayfarer-gateway-topic', [
      { key: 'health', value: 'ok' },
    ]);
    return { status: 'ok' };
  }
}
