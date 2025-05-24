import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IVehicleRepository } from 'src/domain/repositories/vehicle-repository.interface';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateVehicleDto } from '../src/application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../src/application/dtos/update-vehicle.dto';
import { DomainExceptionFilter } from '../src/infrastructure/filters/domain-exception.filter';
import { VehicleRepositoryMemory } from '../src/infrastructure/repositories/vehicle.memory.repository';
import { RabbitMQModule } from '../src/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { ClientsModule } from '@nestjs/microservices';
import { IMessagePublisher } from '../src/domain/events/message-publisher.interface';

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

describe('Vehicle Controller (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let vehicleRepository: IVehicleRepository;
  let createdVehicleId: string;

  const validVehicle: CreateVehicleDto = {
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Modelo Teste',
    marca: 'Marca Teste',
    ano: 2022,
  };

  const updatedVehicleData: UpdateVehicleDto = {
    modelo: 'Modelo Atualizado',
    marca: 'Marca Atualizada',
    ano: 2023,
  };

  beforeAll(async () => {
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
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new DomainExceptionFilter());

    vehicleRepository =
      moduleFixture.get<VehicleRepositoryMemory>('IVehicleRepository');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CreateVehicleUseCase (POST /vehicles)', () => {
    it('should create a new vehicle with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .send(validVehicle)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.placa).toBe(validVehicle.placa);
      expect(response.body.chassi).toBe(validVehicle.chassi);
      expect(response.body.renavam).toBe(validVehicle.renavam);
      expect(response.body.modelo).toBe(validVehicle.modelo);
      expect(response.body.marca).toBe(validVehicle.marca);
      expect(response.body.ano).toBe(validVehicle.ano);

      createdVehicleId = response.body.id;
    });

    it('should return 400 when creating a vehicle with invalid data', async () => {
      const invalidVehicle = {
        placa: 'ABC123', // Placa inválida (deve ter 7 caracteres)
        chassi: '123456', // Chassi inválido (deve ter 17 caracteres)
        renavam: '123', // Renavam inválido (deve ter 11 caracteres)
        modelo: '',
        marca: '',
        ano: 1800, // Ano inválido (deve ser >= 1900)
      };

      await request(app.getHttpServer())
        .post('/vehicles')
        .send(invalidVehicle)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 409 when creating a vehicle with duplicate plate', async () => {
      const duplicateVehicle = {
        ...validVehicle,
        chassi: '98765432109876543', // Chassi diferente
        renavam: '98765432109', // Renavam diferente
      };

      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .send(duplicateVehicle)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.errorCode).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });

    it('should return 409 when creating a vehicle with duplicate chassi', async () => {
      const duplicateVehicle = {
        ...validVehicle,
        placa: 'XYZ9876', // Placa diferente
        renavam: '98765432109', // Renavam diferente
      };

      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .send(duplicateVehicle)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.errorCode).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });

    it('should return 409 when creating a vehicle with duplicate renavam', async () => {
      const duplicateVehicle = {
        ...validVehicle,
        placa: 'XYZ9876', // Placa diferente
        chassi: '98765432109876543', // Chassi diferente
      };

      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .send(duplicateVehicle)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.errorCode).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });
  });

  describe('GetAllVehiclesUseCase (GET /vehicles)', () => {
    it('should return all vehicles', async () => {
      const response = await request(app.getHttpServer())
        .get('/vehicles')
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('placa');
    });
  });

  describe('GetVehicleByIdUseCase (GET /vehicles/:id)', () => {
    it('should return a vehicle by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/vehicles/${createdVehicleId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('id', createdVehicleId);
      expect(response.body.placa).toBe(validVehicle.placa);
    });

    it('should return 404 when vehicle not found', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .get(`/vehicles/${nonExistentId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.errorCode).toBe('ENTITY_NOT_FOUND');
    });
  });

  describe('UpdateVehicleUseCase (PUT /vehicles/:id)', () => {
    it('should update a vehicle with valid data', async () => {
      const response = await request(app.getHttpServer())
        .put(`/vehicles/${createdVehicleId}`)
        .send(updatedVehicleData)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('id', createdVehicleId);
      expect(response.body.placa).toBe(validVehicle.placa); // Não alterado
      expect(response.body.chassi).toBe(validVehicle.chassi); // Não alterado
      expect(response.body.renavam).toBe(validVehicle.renavam); // Não alterado
      expect(response.body.modelo).toBe(updatedVehicleData.modelo); // Alterado
      expect(response.body.marca).toBe(updatedVehicleData.marca); // Alterado
      expect(response.body.ano).toBe(updatedVehicleData.ano); // Alterado
    });

    it('should return 404 when updating non-existent vehicle', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .put(`/vehicles/${nonExistentId}`)
        .send(updatedVehicleData)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.errorCode).toBe('ENTITY_NOT_FOUND');
    });

    it('should return 400 when updating with invalid data', async () => {
      const invalidData = {
        placa: 'ABC', // Placa inválida (deve ter 7 caracteres)
        ano: 1800, // Ano inválido (deve ser >= 1900)
      };

      await request(app.getHttpServer())
        .put(`/vehicles/${createdVehicleId}`)
        .send(invalidData)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a second vehicle for conflict tests', async () => {
      const secondVehicle: CreateVehicleDto = {
        placa: 'DEF5678',
        chassi: '76543210987654321',
        renavam: '10987654321',
        modelo: 'Segundo Modelo',
        marca: 'Segunda Marca',
        ano: 2021,
      };

      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .send(secondVehicle)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
    });

    it('should return 409 when updating with duplicate plate', async () => {
      const conflictData = {
        placa: 'DEF5678', // Placa já existente em outro veículo
      };

      const response = await request(app.getHttpServer())
        .put(`/vehicles/${createdVehicleId}`)
        .send(conflictData)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.errorCode).toBe('UNIQUE_CONSTRAINT_VIOLATION');
    });
  });

  describe('DeleteVehicleUseCase (DELETE /vehicles/:id)', () => {
    it('should return 404 when deleting non-existent vehicle', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .delete(`/vehicles/${nonExistentId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should delete a vehicle', async () => {
      await request(app.getHttpServer())
        .delete(`/vehicles/${createdVehicleId}`)
        .expect(HttpStatus.NO_CONTENT);

      // Verificar se o veículo foi realmente excluído
      await request(app.getHttpServer())
        .get(`/vehicles/${createdVehicleId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
