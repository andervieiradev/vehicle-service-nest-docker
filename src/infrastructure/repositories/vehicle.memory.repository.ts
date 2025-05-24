import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VehicleRepositoryMemory implements IVehicleRepository {
  private vehicles: Vehicle[] = [];

  async findBy(
    field: keyof Vehicle,
    value: unknown,
  ): Promise<Vehicle[] | null> {
    const vehicles = this.vehicles.filter((v) => v[field] === value);
    return vehicles.length > 0 ? [...vehicles] : null;
  }

  async findAll(): Promise<Vehicle[]> {
    return [...this.vehicles];
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = this.vehicles.find((v) => v.id === id);
    return vehicle ? { ...vehicle } : null;
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    // Garantir que o veículo tenha um ID
    if (!vehicle.id) {
      vehicle.id = uuidv4();
    }

    // Criar uma cópia do veículo para evitar referências compartilhadas
    const newVehicle = { ...vehicle };
    this.vehicles.push(newVehicle);

    return { ...newVehicle };
  }

  async update(
    id: string,
    vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      return null;
    }

    // Atualizar as propriedades do veículo
    const updatedVehicle = { ...this.vehicles[index], ...vehicleData };
    this.vehicles[index] = updatedVehicle;

    return { ...updatedVehicle };
  }

  async delete(id: string): Promise<boolean> {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      return false;
    }

    this.vehicles.splice(index, 1);
    return true;
  }
}
