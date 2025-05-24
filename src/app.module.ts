import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infrastructure/config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [ConfigModule, DatabaseModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
