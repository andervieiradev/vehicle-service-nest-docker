import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

@Controller()
export class RabbitMQEventListenerController {
  private readonly logger = new Logger(RabbitMQEventListenerController.name);

  @EventPattern('vehicle.created')
  handleVehicleCreated(vehicle: Vehicle) {
    this.logger.log(
      `Evento recebido - Veículo criado: ${JSON.stringify(vehicle)}`,
    );
    this.logger.log(
      `Veículo de placa ${vehicle.placa} e chassi ${vehicle.chassi} foi cadastrado com sucesso!`,
    );
  }
}
