import { Injectable, Inject } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import {
  UniqueConstraintError,
  EntityCreationError,
} from '../../domain/errors';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if vehicle with same plate already exists
    const [existingVehicleByPlate] = await this.vehicleRepository.findBy(
      'placa',
      createVehicleDto.placa,
    );

    if (existingVehicleByPlate) {
      throw new UniqueConstraintError(
        'Vehicle',
        'plate',
        createVehicleDto.placa,
      );
    }

    // Check if vehicle with same renavam already exists
    const [existingVehicleByRenavam] = await this.vehicleRepository.findBy(
      'renavam',
      createVehicleDto.renavam,
    );

    if (existingVehicleByRenavam) {
      throw new UniqueConstraintError(
        'Vehicle',
        'renavam',
        createVehicleDto.renavam,
      );
    }

    // Check if vehicle with same chassis already exists
    const [existingVehicleByChassis] = await this.vehicleRepository.findBy(
      'chassi',
      createVehicleDto.chassi,
    );

    if (existingVehicleByChassis) {
      throw new UniqueConstraintError(
        'Vehicle',
        'chassis',
        createVehicleDto.chassi,
      );
    }

    const vehicleData = new Vehicle(createVehicleDto);
    const vehicle = this.vehicleRepository.create(vehicleData);

    if (!vehicle) {
      throw new EntityCreationError('Vehicle');
    }

    return vehicle;
  }
}
