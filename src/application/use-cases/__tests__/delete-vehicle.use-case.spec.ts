import { Test, TestingModule } from '@nestjs/testing';
import { DeleteVehicleUseCase } from '../delete-vehicle.use-case';
import { IVehicleRepository } from '../../../domain/repositories/vehicle-repository.interface';

describe('DeleteVehicleUseCase', () => {
  let useCase: DeleteVehicleUseCase;
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;

  beforeEach(async () => {
    // Criando um mock para o repositório
    const mockRepository = {
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteVehicleUseCase,
        {
          provide: 'IVehicleRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteVehicleUseCase>(DeleteVehicleUseCase);
    vehicleRepositoryMock = module.get('IVehicleRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a vehicle successfully', async () => {
      // Arrange
      const vehicleId = 'test-vehicle-id';
      vehicleRepositoryMock.delete.mockResolvedValueOnce(true);

      // Act
      await useCase.execute(vehicleId);

      // Assert
      expect(vehicleRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.delete).toHaveBeenCalledWith(vehicleId);
    });

    it('should propagate error when repository fails to delete vehicle', async () => {
      // Arrange
      const vehicleId = 'test-vehicle-id';
      const errorMessage = 'Erro ao excluir veículo';
      vehicleRepositoryMock.delete.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(useCase.execute(vehicleId)).rejects.toThrow(errorMessage);
      expect(vehicleRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.delete).toHaveBeenCalledWith(vehicleId);
    });
  });
});
