import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaBrokerUrl(): string {
    return this.configService.get<string>('KAFKA_BROKER_URL', 'localhost:9092');
  }

  get kafkaClientId(): string {
    return this.configService.get<string>('KAFKA_CLIENT_ID', 'nestjs-app');
  }
}
