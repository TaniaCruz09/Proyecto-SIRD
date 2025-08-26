import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Grupos } from '../entities/grupos.entity';
import { AnioLectivo } from '../../catalogos/entities/anioLectivo.entity';
import { Turno } from '../../catalogos';
import { Cortes } from 'src/module/catalogos/entities/corte.entity';

export class CreateOrganizacionEscolarDTO {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsObject()
  anio_lectivo: { id: number };

  @IsNotEmpty()
  @IsObject()
  turno: { id: number };

  @IsOptional()
  @IsObject()
  grupo?: { id: number }[];

  @IsArray()
  @ArrayNotEmpty()
  cortes: { id: number }[];

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
