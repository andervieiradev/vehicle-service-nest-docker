import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum DatabaseType {
  MySQL = 'mysql',
  SQLite = 'sqlite',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsEnum(DatabaseType)
  @IsOptional()
  DB_TYPE: DatabaseType = DatabaseType.MySQL;

  @IsString()
  @IsOptional()
  DB_HOST: string;

  @IsNumber()
  @IsOptional()
  DB_PORT: number;

  @IsString()
  @IsOptional()
  DB_USERNAME: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsString()
  @IsOptional()
  DB_SQLITE_FILE: string = 'database.sqlite';
}

import { ValidationError } from '../../domain/errors';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    {
      ...config,
      DB_PORT: config.DB_PORT
        ? parseInt(config.DB_PORT as string, 10)
        : undefined,
    },
    { enableImplicitConversion: true },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new ValidationError(errors.toString());
  }
  return validatedConfig;
}
