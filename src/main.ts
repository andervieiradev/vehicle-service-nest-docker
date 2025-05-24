import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipe e filtros para HTTP
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());

  // Conecta o microserviço RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'vehicles',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Inicia o microserviço
  await app.startAllMicroservices();

  // Inicia o servidor HTTP (porta 3000 por padrão)
  await app.listen(3000);
  console.log('HTTP app running on http://localhost:3000');
}
bootstrap();
