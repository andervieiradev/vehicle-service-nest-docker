import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';

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
    const updatedVehicle = await this.vehicleRepository.update(
      id,
      updateVehicleDto,
    );
    if (!updatedVehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return updatedVehicle;
  }
}
