import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQMessagePublisher } from './rabbitmq-message-publisher.service';
import { RabbitMQEventListenerController } from './rabbitmq-event-listener.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'VEHICLE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://localhost:5672',
              ),
            ],
            queue: configService.get<string>('RABBITMQ_QUEUE', 'vehicles'),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RabbitMQEventListenerController],
  providers: [
    {
      provide: 'IMessagePublisher',
      useClass: RabbitMQMessagePublisher,
    },
  ],
  exports: ['IMessagePublisher'],
})
export class RabbitMQModule {}
