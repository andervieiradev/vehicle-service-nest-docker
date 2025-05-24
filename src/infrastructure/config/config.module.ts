import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),
  ],
  providers: [DatabaseConfig],
  exports: [NestConfigModule, DatabaseConfig],
})
export class ConfigModule {}
