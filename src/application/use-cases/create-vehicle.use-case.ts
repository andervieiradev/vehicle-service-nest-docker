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
    const vehicle = new Vehicle(createVehicleDto);
    return this.vehicleRepository.create(vehicle);
  }
}
