import { Inject, Injectable } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import {
  EntityNotFoundError,
  UniqueConstraintError,
} from '../../domain/errors';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);

    if (!existingVehicle) {
      throw new EntityNotFoundError('Vehicle', id);
    }

    if (updateVehicleDto.placa) {
      const [existingVehicleByPlaca] = await this.vehicleRepository.findBy(
        'placa',
        updateVehicleDto.placa,
      );

      if (existingVehicleByPlaca && existingVehicleByPlaca.id !== id) {
        throw new UniqueConstraintError(
          'Vehicle',
          'placa',
          updateVehicleDto.placa,
        );
      }
    }

    if (updateVehicleDto.chassi) {
      const [existingVehicleByChassi] = await this.vehicleRepository.findBy(
        'chassi',
        updateVehicleDto.chassi,
      );

      if (existingVehicleByChassi && existingVehicleByChassi.id !== id) {
        throw new UniqueConstraintError(
          'Vehicle',
          'chassi',
          updateVehicleDto.chassi,
        );
      }
    }

    if (updateVehicleDto.renavam) {
      const [existingVehicleByRenavam] = await this.vehicleRepository.findBy(
        'renavam',
        updateVehicleDto.renavam,
      );

      if (existingVehicleByRenavam && existingVehicleByRenavam.id !== id) {
        throw new UniqueConstraintError(
          'Vehicle',
          'renavam',
          updateVehicleDto.renavam,
        );
      }
    }

    const updatedVehicle = await this.vehicleRepository.update(
      id,
      updateVehicleDto,
    );

    if (!updatedVehicle) {
      throw new EntityNotFoundError('Vehicle', id);
    }

    return updatedVehicle;
  }
}
