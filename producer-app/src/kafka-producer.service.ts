import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      brokers: (process.env.KAFKA_BROKERS || '').split(','),
      ssl: false,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME as string,
        password: process.env.KAFKA_SASL_PASSWORD as string,
      },
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, message: { key: string; value: string }) {
    await this.producer.send({
      topic,
      messages: [message],
    });
  }
}
