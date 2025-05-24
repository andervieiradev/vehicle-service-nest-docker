import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @Length(7, 7)
  @IsOptional()
  placa?: string;

  @IsString()
  @Length(17, 17)
  @IsOptional()
  chassi?: string;

  @IsString()
  @Length(11, 11)
  @IsOptional()
  renavam?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  ano?: number;
}
