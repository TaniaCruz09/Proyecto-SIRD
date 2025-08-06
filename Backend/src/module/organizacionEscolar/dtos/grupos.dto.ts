import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GradesEntity, Modalidad, Seccion, Turno } from '../../catalogos';


export class CreateGrupoDto {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsObject()
  grado: GradesEntity;

  @IsNotEmpty()
  @IsObject()
  seccion: Seccion;

  @IsNotEmpty()
  @IsObject()
  modalidad: Modalidad;

  @IsNotEmpty()
  @IsObject()
  turno: Turno;

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
