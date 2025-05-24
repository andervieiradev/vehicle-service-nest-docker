import { Vehicle } from '../entities/vehicle.entity';

export class VehicleCreatedEvent {
  constructor(public readonly vehicle: Vehicle) {}
}