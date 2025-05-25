import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IMessagePublisher } from '../src/domain/events/message-publisher.interface';
import { RabbitMQModule } from '../src/infrastructure/messaging/rabbitmq/rabbitmq.module';

// Criação de um mock para o IMessagePublisher
class MockMessagePublisher implements IMessagePublisher {
  publishVehicleCreated = jest.fn().mockImplementation(() => Promise.resolve());
}

// Mock para o módulo RabbitMQ
const mockRabbitMQModule = {
  module: RabbitMQModule,
  providers: [
    {
      provide: 'IMessagePublisher',
      useClass: MockMessagePublisher,
    },
  ],
  exports: ['IMessagePublisher'],
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let messagePublisher: MockMessagePublisher;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(RabbitMQModule)
      .useModule(mockRabbitMQModule)
      .overrideProvider(ClientsModule)
      // Substitui ClientsModule por um mock vazio
      .useValue({
        name: 'VEHICLE_SERVICE',
        useValue: {
          emit: jest.fn().mockImplementation(() => Promise.resolve()),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();

    // Recupera a instância do mock para uso nos testes
    messagePublisher =
      moduleFixture.get<MockMessagePublisher>('IMessagePublisher');

    // Configura um microserviço mock para poder iniciar sem conexão real
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['fake://localhost:5672'],
        queue: 'test-vehicles',
        queueOptions: { durable: false },
      },
    });

    await app.init();
    // Não iniciamos o microserviço para evitar tentativas de conexão real
    // await app.startAllMicroservices();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // Aqui você pode adicionar mais testes verificando se o messagePublisher.publishVehicleCreated
  // foi chamado corretamente quando um veículo é criado

  afterEach(async () => {
    await app.close();
  });
});
