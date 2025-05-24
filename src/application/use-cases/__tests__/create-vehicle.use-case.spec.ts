import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleUseCase } from '../create-vehicle.use-case';
import { IVehicleRepository } from '../../../domain/repositories/vehicle-repository.interface';
import { CreateVehicleDto } from '../../dtos/create-vehicle.dto';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import {
  UniqueConstraintError,
  EntityCreationError,
} from '../../../domain/errors';

describe('CreateVehicleUseCase', () => {
  let useCase: CreateVehicleUseCase;
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleUseCase,
        {
          provide: 'IVehicleRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateVehicleUseCase>(CreateVehicleUseCase);
    vehicleRepositoryMock = module.get('IVehicleRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new vehicle successfully', async () => {
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
    });
  });
});
