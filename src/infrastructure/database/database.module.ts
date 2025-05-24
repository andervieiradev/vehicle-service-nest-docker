import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { DatabaseConfig } from '../config/database.config';
import { Vehicle } from '../../domain/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfig],
      useFactory: (dbConfig: DatabaseConfig) => {
        if (dbConfig.isSqlite) {
          return {
            type: 'sqlite',
            database: dbConfig.sqliteFile,
            entities: [Vehicle],
            synchronize: !dbConfig.isProduction,
            autoLoadEntities: true,
          };
        }

        return {
          type: 'mysql',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [Vehicle],
          synchronize: !dbConfig.isProduction,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
