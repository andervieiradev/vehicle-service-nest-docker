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
    const existingVehicle = await this.vehicleRepository.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    const [existingVehicleByPlate] = await this.vehicleRepository.findBy(
      'placa',
      updateVehicleDto.placa,
    );

    if (existingVehicleByPlate && existingVehicleByPlate.id !== id) {
      throw new Error('Vehicle with same plate already exists');
    }

    const [existingVehicleByChassi] = await this.vehicleRepository.findBy(
      'chassi',
      updateVehicleDto.chassi,
    );

    if (existingVehicleByChassi && existingVehicleByChassi.id !== id) {
      throw new Error('Vehicle with same chassi already exists');
    }

    const [existingVehicleByRenavam] = await this.vehicleRepository.findBy(
      'renavam',
      updateVehicleDto.renavam,
    );

    if (existingVehicleByRenavam && existingVehicleByRenavam.id !== id) {
      throw new Error('Vehicle with same renavam already exists');
    }

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
