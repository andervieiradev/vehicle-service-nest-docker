import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';

@Injectable()
export class VehicleRepositoryTypeOrm implements IVehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find();
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepository.findOneBy({ id });

    if (!vehicle) {
      return null;
    }

    return vehicle;
  }

  async findByPlaca(placa: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOneBy({ placa });
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    return this.vehicleRepository.save(vehicle);
  }

  async update(
    id: string,
    vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    await this.vehicleRepository.update(id, vehicleData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.vehicleRepository.delete(id);
    return result.affected > 0;
  }
}
