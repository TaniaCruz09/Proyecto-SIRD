import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Modalidad } from '../entities/modalidad.entity';

export class CreateTurnoDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  turno: string;

  @IsNotEmpty()
  @IsObject()
  @Type(() => Modalidad)
  modalidad: Modalidad;

  @IsOptional()
  @IsNumber()
  user_create_id: number;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @IsOptional()
  @IsDate()
  update_at: Date;

  @IsOptional()
  @IsNumber()
  user_update_id: number;

  @IsOptional()
  @IsDate()
  deleted_at: Date;

  @IsOptional()
  @IsNumber()
  deleted_at_id: number;
}
