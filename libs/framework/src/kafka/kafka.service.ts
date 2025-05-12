import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, KafkaConfig, Producer, Consumer } from 'kafkajs';

import { KafkaConfigService } from './kafka.config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private kafkaConfigService: KafkaConfigService) {}

  async onModuleInit() {
    const config: KafkaConfig = {
      clientId: this.kafkaConfigService.kafkaClientId,
      brokers: [this.kafkaConfigService.kafkaBrokerUrl],
      ssl: false, // ← disable SSL
      sasl: undefined, // ← disable SASL
      // logLevel: 5,
    };
    this.logger.warn(
      `Connecting to Kafka at ${this.kafkaConfigService.kafkaBrokerUrl}`,
    );

    this.kafka = new Kafka(config);
    this.producer = this.kafka.producer({
      retry: {
        maxRetryTime: 3000,
        retries: 2,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: 'nestjs-group',
      retry: {
        maxRetryTime: 3000,
        retries: 2,
      },
    });

    await this.connectToKafka();
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
    this.logger.log('🛑 Kafka connections closed');
  }

  /**
   * Connects to Kafka with retry logic.
   * @param retries Number of retries before failing.
   * @param delayMs Delay between retries in milliseconds.
   */
  private async connectToKafka() {
    try {
      await this.producer.connect();
      this.logger.log('✅ Kafka Producer connected !!!');

      await this.consumer.connect();
      this.logger.log('✅ Kafka Consumer connected !!!');
      return;
    } catch (err) {
      this.logger.error(`❌ Failed to connect to kafka`, err);
    }

    this.consumer.on(this.consumer.events.CRASH, (e) => {
      this.logger.error('💥 Kafka consumer crashed:', e.payload);
    });
  }

  /**
   * Publishes messages to a Kafka topic.
   * @param topic The topic to publish to.
   * @param messages The messages to publish.
   */
  async publish(
    topic: string,
    messages: { key: string; value: string }[],
  ): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages,
        acks: -1, // wait for all replicas
      });
      this.logger.log(
        `✅ Published to "${topic}": ${JSON.stringify(messages)}`,
      );
    } catch (err) {
      this.logger.error(`❌ Failed to publish to "${topic}": ${err.message}`);
      // Do NOT rethrow — app should continue running
    }
  }

  /**
   * Subscribes to a Kafka topic and processes incoming messages.
   * @param topic The topic to subscribe to.
   * @param onMessage Callback function to handle incoming messages.
   */
  async subscribe<T = any>(
    topic: string,
    onMessage: (payload: T) => void,
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    this.logger.log(`✅ Subscribed to topic "${topic}"`);

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const key = message.key?.toString();
        const value = message.value?.toString();
        const payload = JSON.parse(value);

        this.logger.log(
          `📬 Received message from "${topic}" - "${key}": - ${value}`,
        );

        onMessage(payload);
      },
    });
  }
}
