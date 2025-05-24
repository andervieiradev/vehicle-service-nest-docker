import { Inject, Injectable } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { EntityNotFoundError } from '../../domain/errors';

@Injectable()
export class GetVehicleByIdUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new EntityNotFoundError('Vehicle', id);
    }

    return vehicle;
  }
}
