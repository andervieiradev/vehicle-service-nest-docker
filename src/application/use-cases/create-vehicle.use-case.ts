import { Injectable, Inject } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if vehicle with same plate already exists
    const existingVehicleByPlate = await this.vehicleRepository.findBy(
      'placa',
      createVehicleDto.placa,
    );

    if (existingVehicleByPlate) {
      throw new Error('Vehicle with this plate already exists');
    }

    // Check if vehicle with same renavam already exists
    const existingVehicleByRenavam = await this.vehicleRepository.findBy(
      'renavam',
      createVehicleDto.renavam,
    );

    if (existingVehicleByRenavam) {
      throw new Error('Vehicle with this renavam already exists');
    }

    // Check if vehicle with same chassis already exists
    const existingVehicleByChassis = await this.vehicleRepository.findBy(
      'chassi',
      createVehicleDto.chassi,
    );

    if (existingVehicleByChassis) {
      throw new Error('Vehicle with this chassis already exists');
    }

    const vehicleData = new Vehicle(createVehicleDto);
    const vehicle = this.vehicleRepository.create(vehicleData);

    if (!vehicle) {
      throw new Error('Vehicle not created');
    }

    return vehicle;
  }
}
