import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleUseCase } from '../create-vehicle.use-case';
import { IVehicleRepository } from '../../../domain/repositories/vehicle-repository.interface';
import { CreateVehicleDto } from '../../dtos/create-vehicle.dto';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import {
  UniqueConstraintError,
  EntityCreationError,
} from '../../../domain/errors';
import { IMessagePublisher } from '../../../domain/events/message-publisher.interface';

describe('CreateVehicleUseCase', () => {
  let useCase: CreateVehicleUseCase;
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;
  let messagePublisherMock: jest.Mocked<IMessagePublisher>;

  const validVehicleDto: CreateVehicleDto = {
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Modelo Teste',
    marca: 'Marca Teste',
    ano: 2022,
  };

  const createdVehicle: Vehicle = {
    id: 'test-id',
    ...validVehicleDto,
  };

  beforeEach(async () => {
    // Criando um mock para o repositório
    const mockRepository = {
      findBy: jest.fn(),
      create: jest.fn(),
    };

    // Criando um mock para o publicador de mensagens
    const mockMessagePublisher = {
      publishVehicleCreated: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleUseCase,
        {
          provide: 'IVehicleRepository',
          useValue: mockRepository,
        },
        {
          provide: 'IMessagePublisher',
          useValue: mockMessagePublisher,
        },
      ],
    }).compile();

    useCase = module.get<CreateVehicleUseCase>(CreateVehicleUseCase);
    vehicleRepositoryMock = module.get('IVehicleRepository');
    messagePublisherMock = module.get('IMessagePublisher');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new vehicle successfully and publish event', async () => {
      // Arrange
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // chassi não existe
      vehicleRepositoryMock.create.mockResolvedValueOnce(createdVehicle);

      // Act
      const result = await useCase.execute(validVehicleDto);

      // Assert
      expect(result).toEqual(createdVehicle);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'placa',
        validVehicleDto.placa,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'renavam',
        validVehicleDto.renavam,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'chassi',
        validVehicleDto.chassi,
      );
      expect(vehicleRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.create).toHaveBeenCalledWith(
        expect.any(Vehicle),
      );
      // Verificar se o evento foi publicado
      expect(messagePublisherMock.publishVehicleCreated).toHaveBeenCalledTimes(
        1,
      );
      expect(messagePublisherMock.publishVehicleCreated).toHaveBeenCalledWith(
        createdVehicle,
      );
    });

    it('should throw UniqueConstraintError when vehicle with same placa already exists', async () => {
      // Arrange
      const existingVehicle = { ...createdVehicle };
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([existingVehicle]);

      // Act & Assert
      await expect(useCase.execute(validVehicleDto)).rejects.toThrow(
        UniqueConstraintError,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'placa',
        validVehicleDto.placa,
      );
      expect(vehicleRepositoryMock.create).not.toHaveBeenCalled();
      // Verificar que o evento não foi publicado
      expect(messagePublisherMock.publishVehicleCreated).not.toHaveBeenCalled();
    });

    it('should throw UniqueConstraintError when vehicle with same renavam already exists', async () => {
      // Arrange
      const existingVehicle = { ...createdVehicle };
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([existingVehicle]); // renavam existe

      // Act & Assert
      await expect(useCase.execute(validVehicleDto)).rejects.toThrow(
        UniqueConstraintError,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(2);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'placa',
        validVehicleDto.placa,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'renavam',
        validVehicleDto.renavam,
      );
      expect(vehicleRepositoryMock.create).not.toHaveBeenCalled();
      // Verificar que o evento não foi publicado
      expect(messagePublisherMock.publishVehicleCreated).not.toHaveBeenCalled();
    });

    it('should throw UniqueConstraintError when vehicle with same chassi already exists', async () => {
      // Arrange
      const existingVehicle = { ...createdVehicle };
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([existingVehicle]); // chassi existe

      // Act & Assert
      await expect(useCase.execute(validVehicleDto)).rejects.toThrow(
        UniqueConstraintError,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'placa',
        validVehicleDto.placa,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'renavam',
        validVehicleDto.renavam,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'chassi',
        validVehicleDto.chassi,
      );
      expect(vehicleRepositoryMock.create).not.toHaveBeenCalled();
      // Verificar que o evento não foi publicado
      expect(messagePublisherMock.publishVehicleCreated).not.toHaveBeenCalled();
    });

    it('should throw EntityCreationError when repository fails to create vehicle', async () => {
      // Arrange
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // chassi não existe
      vehicleRepositoryMock.create.mockRejectedValueOnce(
        new EntityCreationError('Erro no repositório'),
      ); // erro no repositório

      // Act & Assert
      await expect(useCase.execute(validVehicleDto)).rejects.toThrow(
        EntityCreationError,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.create).toHaveBeenCalledTimes(1);
      // Verificar que o evento não foi publicado
      expect(messagePublisherMock.publishVehicleCreated).not.toHaveBeenCalled();
    });

    it('should throw error when message publisher fails', async () => {
      // Arrange
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // chassi não existe
      vehicleRepositoryMock.create.mockResolvedValueOnce(createdVehicle);
      messagePublisherMock.publishVehicleCreated.mockRejectedValueOnce(
        new Error('Erro ao publicar mensagem'),
      );

      // Act & Assert
      await expect(useCase.execute(validVehicleDto)).rejects.toThrow(Error);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(messagePublisherMock.publishVehicleCreated).toHaveBeenCalledTimes(
        1,
      );
      expect(messagePublisherMock.publishVehicleCreated).toHaveBeenCalledWith(
        createdVehicle,
      );
    });
  });
});
