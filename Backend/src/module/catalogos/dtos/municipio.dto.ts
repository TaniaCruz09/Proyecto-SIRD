import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Departamento } from '../entities/departamento.entity';

export class CreateMunicipioDto {
  @IsOptional()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly municipio: string;

  @IsNotEmpty()
  @IsObject()
  departamento: Departamento;

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
