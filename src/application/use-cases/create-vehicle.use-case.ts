import { Injectable, Inject } from '@nestjs/common';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import {
  UniqueConstraintError,
  EntityCreationError,
} from '../../domain/errors';
import { IMessagePublisher } from '../../domain/events/message-publisher.interface';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject('IVehicleRepository')
    private vehicleRepository: IVehicleRepository,
    @Inject('IMessagePublisher')
    private messagePublisher: IMessagePublisher,
  ) {}

  async execute(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if vehicle with same placa already exists
    const [existingVehicleByPlaca] = await this.vehicleRepository.findBy(
      'placa',
      createVehicleDto.placa,
    );

    if (existingVehicleByPlaca) {
      throw new UniqueConstraintError(
        'Vehicle',
        'placa',
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
    const [existingVehicleByChassi] = await this.vehicleRepository.findBy(
      'chassi',
      createVehicleDto.chassi,
    );

    if (existingVehicleByChassi) {
      throw new UniqueConstraintError(
        'Vehicle',
        'chassi',
        createVehicleDto.chassi,
      );
    }

    const vehicleData = new Vehicle(createVehicleDto);
    const vehicle = await this.vehicleRepository.create(vehicleData);

    if (!vehicle) {
      throw new EntityCreationError('Vehicle');
    }

    // Publicar evento de veículo criado
    await this.messagePublisher.publishVehicleCreated(vehicle);

    return vehicle;
  }
}
