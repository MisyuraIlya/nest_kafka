import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleDestroy {
  constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {}

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
