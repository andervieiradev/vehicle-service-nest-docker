import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.vehicleRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
  }
}
