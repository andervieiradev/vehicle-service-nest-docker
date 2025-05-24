import { Injectable, Inject } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';

@Injectable()
export class GetAllVehiclesUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }
}
