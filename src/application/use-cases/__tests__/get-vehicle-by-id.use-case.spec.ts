import { Test, TestingModule } from '@nestjs/testing';
import { GetVehicleByIdUseCase } from '../get-vehicle-by-id.use-case';
import { IVehicleRepository } from '../../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { EntityNotFoundError } from '../../../domain/errors';

describe('GetVehicleByIdUseCase', () => {
  let useCase: GetVehicleByIdUseCase;
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;

  beforeEach(async () => {
    // Criando um mock para o repositório
    const mockRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVehicleByIdUseCase,
        {
          provide: 'IVehicleRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetVehicleByIdUseCase>(GetVehicleByIdUseCase);
    vehicleRepositoryMock = module.get('IVehicleRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a vehicle when it exists', async () => {
      // Arrange
      const vehicleId = 'test-vehicle-id';
      const mockVehicle: Vehicle = {
        id: vehicleId,
        placa: 'ABC1234',
        chassi: '12345678901234567',
        renavam: '12345678901',
        modelo: 'Modelo Teste',
        marca: 'Marca Teste',
        ano: 2022,
      };

      vehicleRepositoryMock.findById.mockResolvedValueOnce(mockVehicle);

      // Act
      const result = await useCase.execute(vehicleId);

      // Assert
      expect(result).toEqual(mockVehicle);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledWith(vehicleId);
    });

    it('should throw EntityNotFoundError when vehicle does not exist', async () => {
      // Arrange
      const vehicleId = 'nonexistent-vehicle-id';
      vehicleRepositoryMock.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(useCase.execute(vehicleId)).rejects.toThrow(
        EntityNotFoundError,
      );

      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledWith(vehicleId);
    });

    it('should throw specific error message when vehicle is not found', async () => {
      // Arrange
      const vehicleId = 'nonexistent-vehicle-id';
      vehicleRepositoryMock.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(useCase.execute(vehicleId)).rejects.toThrow(
        `Vehicle with ID ${vehicleId} not found`,
      );

      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledWith(vehicleId);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const vehicleId = 'test-vehicle-id';
      const errorMessage = 'Database connection error';
      vehicleRepositoryMock.findById.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(useCase.execute(vehicleId)).rejects.toThrow(errorMessage);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledWith(vehicleId);
    });
  });
});
