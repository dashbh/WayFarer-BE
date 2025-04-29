import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
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
    };
    this.logger.log(`Connecting to Kafka at ${this.kafkaConfigService.kafkaBrokerUrl}`);
  
    this.kafka = new Kafka(config);
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-group' });

    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    // await this.consumer.disconnect();
    // await this.producer.disconnect();
    // this.logger.log('🛑 Kafka connections closed');
  }

  /**
   * Connects to Kafka with retry logic.
   * @param retries Number of retries before failing.
   * @param delayMs Delay between retries in milliseconds.
   */
  private async connectWithRetry(retries = 10, delayMs = 3000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.producer.connect();
        this.logger.log('✅ Kafka Producer connected !!!');

        await this.consumer.connect();
        this.logger.log('✅ Kafka Consumer connected !!!');
        return;
      } catch (err) {
        this.logger.error(`❌ Kafka connection failed (attempt ${i + 1})`, err);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
    throw new Error('❌ Failed to connect to Kafka after multiple retries');
  }

  /**
   * Publishes messages to a Kafka topic.
   * @param topic The topic to publish to.
   * @param messages The messages to publish.
   */
  async publish(topic: string, messages: { key: string; value: string }[]): Promise<void> {
    await this.producer.send({ topic, messages });
    this.logger.log(`✅ Published to "${topic}": ${JSON.stringify(messages)}`);
  }
  
  /**
   * Subscribes to a Kafka topic and processes incoming messages.
   * @param topic The topic to subscribe to.
   * @param onMessage Callback function to handle incoming messages.
   */
  async subscribe<T = any>(topic: string, onMessage: (payload: T) => void): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    this.logger.log(`✅ Subscribed to topic "${topic}"`);
  
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString() ?? '{}';
          const parsed: T = JSON.parse(value);
          this.logger.debug(`📨 Received on "${topic}": ${value}`);
          onMessage(parsed);
        } catch (err) {
          this.logger.error(`❌ Failed to handle message on "${topic}"`, err);
        }
      },
    });
  }
}
