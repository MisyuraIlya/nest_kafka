import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka, logLevel } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const consumer = kafka.consumer({ groupId: 'nestjs-consumer-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        topic,
        partition,
        key: message.key?.toString(),
      });
    },
  });

  await app.listen(3001);
  console.log('Consumer service is running on port 3001');
}

bootstrap();
