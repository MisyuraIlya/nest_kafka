import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Kafka, logLevel } from 'kafkajs';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: 'KAFKA_CLIENT',
      useFactory: () => {
        return new Kafka({
          brokers: (process.env.KAFKA_BROKERS || '').split(','),
          ssl: false,
          sasl: {
            mechanism: 'plain',
            username: process.env.KAFKA_SASL_USERNAME as string,
            password: process.env.KAFKA_SASL_PASSWORD as string,
          },
          logLevel: logLevel.INFO,
        });
      },
    },
    AppService,
  ],
  exports: ['KAFKA_CLIENT'],
})
export class AppModule {}
