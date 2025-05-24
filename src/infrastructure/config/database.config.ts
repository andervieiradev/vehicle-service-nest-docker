import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get type(): 'mysql' | 'sqlite' {
    return this.configService.get<'mysql' | 'sqlite'>('DB_TYPE', 'mysql');
  }

  get isMySql(): boolean {
    return this.type === 'mysql';
  }

  get isSqlite(): boolean {
    return this.type === 'sqlite';
  }

  get host(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get port(): number {
    return this.configService.get<number>('DB_PORT', 3306);
  }

  get username(): string {
    return this.configService.get<string>('DB_USERNAME', 'root');
  }

  get password(): string {
    return this.configService.get<string>('DB_PASSWORD', 'password');
  }

  get database(): string {
    return this.configService.get<string>('DB_DATABASE', 'vehicle_db');
  }

  get sqliteFile(): string {
    return this.configService.get<string>('DB_SQLITE_FILE', 'database.sqlite');
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}
