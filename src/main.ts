import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do microserviço RabbitMQ
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'vehicles',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Pipe e filtros para HTTP
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());

  // Iniciar o microserviço antes de escutar na porta HTTP
  await app.startAllMicroservices();

  // Inicia o servidor HTTP (porta 3000 por padrão)
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('HTTP app running on port', port);
  console.log('RabbitMQ listener is active and waiting for messages');
}
bootstrap();
