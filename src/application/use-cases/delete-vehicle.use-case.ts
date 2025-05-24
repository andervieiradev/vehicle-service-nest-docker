import { Inject, Injectable } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
