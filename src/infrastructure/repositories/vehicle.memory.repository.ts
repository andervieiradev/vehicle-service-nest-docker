import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { IVehicleRepository } from '../../domain/repositories/vehicle-repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VehicleRepositoryMemory implements IVehicleRepository {
  private vehicles: Vehicle[] = [];

  async findAll(): Promise<Vehicle[]> {
    return [...this.vehicles];
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = this.vehicles.find((v) => v.id === id);
    return vehicle ? { ...vehicle } : null;
  }

  async findByPlaca(placa: string): Promise<Vehicle | null> {
    const vehicle = this.vehicles.find((v) => v.placa === placa);
    return vehicle ? { ...vehicle } : null;
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    // Garantir que o veículo tenha um ID
    if (!vehicle.id) {
      vehicle.id = uuidv4();
    }

    // Verificar se já existe um veículo com a mesma placa, chassi ou renavam
    const existingPlaca = await this.findByPlaca(vehicle.placa);
    if (existingPlaca) {
      throw new Error(`Vehicle with placa ${vehicle.placa} already exists`);
    }

    const existingChassi = this.vehicles.find(
      (v) => v.chassi === vehicle.chassi,
    );
    if (existingChassi) {
      throw new Error(`Vehicle with chassi ${vehicle.chassi} already exists`);
    }

    const existingRenavam = this.vehicles.find(
      (v) => v.renavam === vehicle.renavam,
    );
    if (existingRenavam) {
      throw new Error(`Vehicle with renavam ${vehicle.renavam} already exists`);
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

    // Verificar se está tentando atualizar para uma placa, chassi ou renavam que já existe
    if (vehicleData.placa) {
      const existingPlaca = await this.findByPlaca(vehicleData.placa);
      if (existingPlaca && existingPlaca.id !== id) {
        throw new Error(
          `Vehicle with placa ${vehicleData.placa} already exists`,
        );
      }
    }

    if (vehicleData.chassi) {
      const existingChassi = this.vehicles.find(
        (v) => v.chassi === vehicleData.chassi && v.id !== id,
      );
      if (existingChassi) {
        throw new Error(
          `Vehicle with chassi ${vehicleData.chassi} already exists`,
        );
      }
    }

    if (vehicleData.renavam) {
      const existingRenavam = this.vehicles.find(
        (v) => v.renavam === vehicleData.renavam && v.id !== id,
      );
      if (existingRenavam) {
        throw new Error(
          `Vehicle with renavam ${vehicleData.renavam} already exists`,
        );
      }
    }

    // Atualizar o veículo
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
