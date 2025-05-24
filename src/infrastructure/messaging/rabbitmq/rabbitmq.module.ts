import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQMessagePublisher } from './rabbitmq-message-publisher.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VEHICLE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'vehicles',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: 'IMessagePublisher',
      useClass: RabbitMQMessagePublisher,
    },
  ],
  exports: ['IMessagePublisher'],
})
export class RabbitMQModule {}
