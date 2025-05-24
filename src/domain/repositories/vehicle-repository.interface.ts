import { Vehicle } from '../entities/vehicle.entity';

export interface IVehicleRepository {
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  findByPlaca(placa: string): Promise<Vehicle | null>;
  create(vehicle: Vehicle): Promise<Vehicle>;
  update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
}
