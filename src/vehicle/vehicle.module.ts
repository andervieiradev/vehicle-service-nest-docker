import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../domain/entities/vehicle.entity';
import { VehicleRepositoryTypeOrm } from '../infrastructure/repositories/vehicle.typeorm.repository';
import { CreateVehicleUseCase } from 'src/application/use-cases/create-vehicle.use-case';
import { DeleteVehicleUseCase } from '../application/use-cases/delete-vehicle.use-case';
import { GetAllVehiclesUseCase } from '../application/use-cases/get-all-vehicles.use-case';
import { GetVehicleByIdUseCase } from '../application/use-cases/get-vehicle-by-id.use-case';
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case';
import { VehicleController } from '../presentation/controllers/vehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [
    {
      provide: 'IVehicleRepository',
      useClass: VehicleRepositoryTypeOrm,
    },
    CreateVehicleUseCase,
    GetAllVehiclesUseCase,
    GetVehicleByIdUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
  ],
})
export class VehicleModule {}
