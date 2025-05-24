import { Test, TestingModule } from '@nestjs/testing';
import { GetAllVehiclesUseCase } from '../get-all-vehicles.use-case';
import { IVehicleRepository } from '../../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

describe('GetAllVehiclesUseCase', () => {
  let useCase: GetAllVehiclesUseCase;
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;

  beforeEach(async () => {
    // Criando um mock para o repositório
    const mockRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllVehiclesUseCase,
        {
          provide: 'IVehicleRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllVehiclesUseCase>(GetAllVehiclesUseCase);
    vehicleRepositoryMock = module.get('IVehicleRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all vehicles successfully', async () => {
      // Arrange
      const mockVehicles: Vehicle[] = [
        {
          id: 'test-id-1',
          placa: 'ABC1234',
          chassi: '12345678901234567',
          renavam: '12345678901',
          modelo: 'Modelo Teste 1',
          marca: 'Marca Teste 1',
          ano: 2021,
        },
        {
          id: 'test-id-2',
          placa: 'XYZ9876',
          chassi: '76543210987654321',
          renavam: '10987654321',
          modelo: 'Modelo Teste 2',
          marca: 'Marca Teste 2',
          ano: 2022,
        },
      ];

      vehicleRepositoryMock.findAll.mockResolvedValueOnce(mockVehicles);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(mockVehicles);
      expect(vehicleRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no vehicles exist', async () => {
      // Arrange
      const emptyVehicles: Vehicle[] = [];
      vehicleRepositoryMock.findAll.mockResolvedValueOnce(emptyVehicles);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(vehicleRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate error when repository fails', async () => {
      // Arrange
      const errorMessage = 'Erro ao buscar veículos';
      vehicleRepositoryMock.findAll.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(errorMessage);
      expect(vehicleRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
