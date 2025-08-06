import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GradesEntity, Modalidad, Seccion, Turno } from '../../catalogos';


export class UpdateGrupoDto {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsOptional()
  @IsObject()
  grado?: GradesEntity;

  @IsOptional()
  @IsObject()
  seccion?: Seccion;

  @IsOptional()
  @IsObject()
  modalidad?: Modalidad;

  @IsOptional()
  @IsObject()
  turno?: Turno;

  @IsOptional()
  @IsNumber()
  user_create_id?: number;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  update_at?: Date;

  @IsOptional()
  @IsNumber()
  user_update_id?: number;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;

  @IsOptional()
  @IsNumber()
  deleted_at_id?: number;
}
