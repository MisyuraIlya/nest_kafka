import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka-producer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,KafkaProducerService],
})
export class AppModule {}
