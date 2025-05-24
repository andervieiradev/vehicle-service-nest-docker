import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { CreateVehicleUseCase } from '../../application/use-cases/create-vehicle.use-case';
import { GetAllVehiclesUseCase } from '../../application/use-cases/get-all-vehicles.use-case';
import { GetVehicleByIdUseCase } from '../../application/use-cases/get-vehicle-by-id.use-case';
import { UpdateVehicleUseCase } from '../../application/use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from '../../application/use-cases/delete-vehicle.use-case';
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../application/dtos/update-vehicle.dto';
import { Vehicle } from '../../domain/entities/vehicle.entity';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly getAllVehiclesUseCase: GetAllVehiclesUseCase,
    private readonly getVehicleByIdUseCase: GetVehicleByIdUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.createVehicleUseCase.execute(createVehicleDto);
  }

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return this.getAllVehiclesUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicle> {
    return this.getVehicleByIdUseCase.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.updateVehicleUseCase.execute(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteVehicleUseCase.execute(id);
  }
}
