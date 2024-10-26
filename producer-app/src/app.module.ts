import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka-producer.service';
import { Kafka, logLevel } from 'kafkajs';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async () => {
        const kafka = new Kafka({
          brokers: (process.env.KAFKA_BROKERS || '').split(','),
          ssl: false,
          sasl: {
            mechanism: 'plain',
            username: process.env.KAFKA_SASL_USERNAME as string,
            password: process.env.KAFKA_SASL_PASSWORD as string,
          },
          logLevel: logLevel.INFO,
        });

        const producer = kafka.producer();

        try {
          await producer.connect();
          console.log('Kafka producer connected successfully');
        } catch (error) {
          console.error(`Failed to connect to Kafka: ${error.message}`);
        }

        return producer;
      },
    },
    KafkaProducerService,
    AppService,
  ],
  exports: ['KAFKA_PRODUCER'],
})
export class AppModule {}
