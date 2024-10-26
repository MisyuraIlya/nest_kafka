import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka, logLevel } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafka = new Kafka({
    brokers: (process.env.KAFKA_BROKERS || '').split(','),
    ssl: false,
    sasl: {
      mechanism: 'plain', // specify 'plain' as the mechanism
      username: process.env.KAFKA_SASL_USERNAME as string,
      password: process.env.KAFKA_SASL_PASSWORD as string,
    },
    logLevel: logLevel.INFO,
  });

  const producer = kafka.producer();

  producer.on('producer.connect', () => {
    console.log('Successfully connected to Kafka');
  });

  producer.on('producer.disconnect', () => {
    console.log('Disconnected from Kafka');
  });

  producer.on('producer.network.request_timeout', (e) => {
    console.error(`Kafka connection timeout: ${e}`);
  });

  try {
    await producer.connect();
    console.log('Producer successfully connected and ready to send messages.');
  } catch (error) {
    console.error(`Failed to connect to Kafka: ${error.message}`);
  }

  await app.listen(3000);
  console.log('Producer service is running on port 3000');
}

bootstrap();
