import { Test, TestingModule } from '@nestjs/testing';
import { UpdateVehicleUseCase } from '../update-vehicle.use-case';
import { IVehicleRepository } from '../../../domain/repositories/vehicle-repository.interface';
import { UpdateVehicleDto } from '../../dtos/update-vehicle.dto';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import {
  EntityNotFoundError,
  UniqueConstraintError,
} from '../../../domain/errors';

describe('UpdateVehicleUseCase', () => {
  let useCase: UpdateVehicleUseCase;
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;

  const existingVehicle: Vehicle = {
    id: 'test-id',
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Modelo Teste',
    marca: 'Marca Teste',
    ano: 2022,
  };

  const validUpdateDto: UpdateVehicleDto = {
    placa: 'XYZ5678',
    chassi: '76543210987654321',
    renavam: '10987654321',
    modelo: 'Modelo Atualizado',
    marca: 'Marca Atualizada',
    ano: 2023,
  };

  const updatedVehicle: Vehicle = {
    ...existingVehicle,
    ...validUpdateDto,
  };

  beforeEach(async () => {
    // Criando um mock para o repositório
    const mockRepository = {
      findById: jest.fn(),
      findBy: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateVehicleUseCase,
        {
          provide: 'IVehicleRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateVehicleUseCase>(UpdateVehicleUseCase);
    vehicleRepositoryMock = module.get('IVehicleRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a vehicle successfully with all fields', async () => {
      // Arrange
      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // chassi não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.update.mockResolvedValueOnce(updatedVehicle);

      // Act
      const result = await useCase.execute(existingVehicle.id, validUpdateDto);

      // Assert
      expect(result).toEqual(updatedVehicle);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledWith(
        existingVehicle.id,
      );
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.update).toHaveBeenCalledWith(
        existingVehicle.id,
        validUpdateDto,
      );
    });

    it('should update a vehicle successfully with partial fields', async () => {
      // Arrange
      const partialUpdateDto: UpdateVehicleDto = {
        modelo: 'Novo Modelo',
        ano: 2024,
      };
      const partiallyUpdatedVehicle = {
        ...existingVehicle,
        ...partialUpdateDto,
      };

      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.update.mockResolvedValueOnce(
        partiallyUpdatedVehicle,
      );

      // Act
      const result = await useCase.execute(
        existingVehicle.id,
        partialUpdateDto,
      );

      // Assert
      expect(result).toEqual(partiallyUpdatedVehicle);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).not.toHaveBeenCalled();
      expect(vehicleRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.update).toHaveBeenCalledWith(
        existingVehicle.id,
        partialUpdateDto,
      );
    });

    it('should throw EntityNotFoundError when vehicle does not exist', async () => {
      // Arrange
      const nonExistentId = 'non-existent-id';
      vehicleRepositoryMock.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        useCase.execute(nonExistentId, validUpdateDto),
      ).rejects.toThrow(EntityNotFoundError);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledWith(
        nonExistentId,
      );
      expect(vehicleRepositoryMock.findBy).not.toHaveBeenCalled();
      expect(vehicleRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw UniqueConstraintError when another vehicle with same placa already exists', async () => {
      // Arrange
      const anotherVehicle: Vehicle = {
        id: 'another-id',
        placa: validUpdateDto.placa!,
        chassi: '99999999999999999',
        renavam: '99999999999',
        modelo: 'Outro modelo',
        marca: 'Outra marca',
        ano: 2020,
      };

      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([anotherVehicle]); // placa existe em outro veículo

      // Act & Assert
      await expect(
        useCase.execute(existingVehicle.id, validUpdateDto),
      ).rejects.toThrow(UniqueConstraintError);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'placa',
        validUpdateDto.placa,
      );
      expect(vehicleRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw UniqueConstraintError when another vehicle with same chassi already exists', async () => {
      // Arrange
      const anotherVehicle: Vehicle = {
        id: 'another-id',
        placa: 'DEF5678',
        chassi: validUpdateDto.chassi!,
        renavam: '99999999999',
        modelo: 'Outro modelo',
        marca: 'Outra marca',
        ano: 2020,
      };

      const partialUpdateDto: UpdateVehicleDto = {
        chassi: validUpdateDto.chassi,
      };

      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([anotherVehicle]); // chassi existe em outro veículo

      // Act & Assert
      await expect(
        useCase.execute(existingVehicle.id, partialUpdateDto),
      ).rejects.toThrow(UniqueConstraintError);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'chassi',
        partialUpdateDto.chassi,
      );
      expect(vehicleRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should throw UniqueConstraintError when another vehicle with same renavam already exists', async () => {
      // Arrange
      const anotherVehicle: Vehicle = {
        id: 'another-id',
        placa: 'DEF5678',
        chassi: '99999999999999999',
        renavam: validUpdateDto.renavam!,
        modelo: 'Outro modelo',
        marca: 'Outra marca',
        ano: 2020,
      };

      const partialUpdateDto: UpdateVehicleDto = {
        renavam: validUpdateDto.renavam,
      };

      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([anotherVehicle]); // renavam existe em outro veículo

      // Act & Assert
      await expect(
        useCase.execute(existingVehicle.id, partialUpdateDto),
      ).rejects.toThrow(UniqueConstraintError);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledWith(
        'renavam',
        partialUpdateDto.renavam,
      );
      expect(vehicleRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should not throw UniqueConstraintError when updated vehicle has same placa as itself', async () => {
      // Arrange
      const updateDto: UpdateVehicleDto = {
        placa: existingVehicle.placa, // mesma placa
        modelo: 'Modelo Atualizado',
      };

      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([existingVehicle]); // placa existe, mas é do mesmo veículo
      vehicleRepositoryMock.update.mockResolvedValueOnce({
        ...existingVehicle,
        modelo: updateDto.modelo,
      });

      // Act & Assert
      await expect(
        useCase.execute(existingVehicle.id, updateDto),
      ).resolves.not.toThrow();
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.update).toHaveBeenCalledTimes(1);
    });

    it('should throw EntityNotFoundError when repository fails to update vehicle', async () => {
      // Arrange
      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // chassi não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.update.mockResolvedValueOnce(null); // falha na atualização

      // Act & Assert
      await expect(
        useCase.execute(existingVehicle.id, validUpdateDto),
      ).rejects.toThrow(EntityNotFoundError);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.update).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors during update', async () => {
      // Arrange
      const errorMessage = 'Database connection error';
      vehicleRepositoryMock.findById.mockResolvedValueOnce(existingVehicle);
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // placa não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // chassi não existe
      vehicleRepositoryMock.findBy.mockResolvedValueOnce([]); // renavam não existe
      vehicleRepositoryMock.update.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(
        useCase.execute(existingVehicle.id, validUpdateDto),
      ).rejects.toThrow(errorMessage);
      expect(vehicleRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(vehicleRepositoryMock.findBy).toHaveBeenCalledTimes(3);
      expect(vehicleRepositoryMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
