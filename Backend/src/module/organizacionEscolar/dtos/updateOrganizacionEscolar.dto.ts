import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Grupos } from '../entities/grupos.entity';

export class UpdateOrganizacionEscolarDTO {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsOptional()
  @IsObject()
  anio_lectivo?: { id: number };

  @IsOptional()
  @IsObject()
  turno?: { id: number };

  @IsOptional()
  @IsObject()
  grupo?: { id: number }[];

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
