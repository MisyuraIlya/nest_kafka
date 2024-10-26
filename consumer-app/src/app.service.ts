import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private consumer: Consumer;

  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: Kafka) {}

  async onModuleInit() {
    await this.initKafkaConsumer();
  }

  private async initKafkaConsumer() {
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-consumer-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log({
          value: message.value.toString(),
          topic,
          partition,
          key: message.key?.toString(),
        });
      },
    });
  }
}
