import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { IMessagePublisher } from '../../../domain/events/message-publisher.interface';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

@Injectable()
export class RabbitMQMessagePublisher implements IMessagePublisher {
  constructor(
    @Inject('VEHICLE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishVehicleCreated(vehicle: Vehicle): Promise<void> {
    await this.client.emit('vehicle.created', vehicle).toPromise();
  }
}
