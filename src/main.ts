import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipe e filtros para HTTP
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());

  // Inicia o servidor HTTP (porta 3000 por padrão)
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('HTTP app running on port', port);
}
bootstrap();
