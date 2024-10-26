import { Controller, Get } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';


@Controller()
export class AppController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Get('')
  async sendMessage() {
    console.log('here')
    await this.kafkaProducerService.sendMessage('test-topic', {
      key: 'key1',
      value: 'Hello from Producer!',
    });
    return 'Message sent to Kafka';
  }
}
