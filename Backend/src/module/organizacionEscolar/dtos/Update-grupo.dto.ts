import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GradesEntity, Seccion, Turno } from '../../catalogos';
import { Docentes } from '../../docentes/docentes.entity';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';


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
  turno?: Turno;

  @IsOptional()
  @IsObject()
  docenteGuia?: Docentes;

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
