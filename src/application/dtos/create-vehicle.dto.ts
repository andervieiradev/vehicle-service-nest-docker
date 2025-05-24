import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @Length(7, 7)
  @IsNotEmpty()
  placa: string;

  @IsString()
  @Length(17, 17)
  @IsNotEmpty()
  chassi: string;

  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  renavam: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano: number;
}
