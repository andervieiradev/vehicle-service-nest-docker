import { Vehicle } from '../entities/vehicle.entity';

export interface IMessagePublisher {
  publishVehicleCreated(vehicle: Vehicle): Promise<void>;
}