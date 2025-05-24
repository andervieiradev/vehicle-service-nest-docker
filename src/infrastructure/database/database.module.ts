import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { DatabaseConfig } from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfig],
      useFactory: (dbConfig: DatabaseConfig) => {
        if (dbConfig.isTest) {
          return {
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            synchronize: !dbConfig.isProduction,
          };
        }

        if (dbConfig.isSqlite) {
          return {
            type: 'sqlite',
            database: dbConfig.sqliteFile,
            synchronize: !dbConfig.isProduction,
            autoLoadEntities: true,
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          };
        }

        return {
          type: 'mysql',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: !dbConfig.isProduction,
          autoLoadEntities: true,
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
