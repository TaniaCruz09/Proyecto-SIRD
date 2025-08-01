import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GradesEntity, Modalidad, Seccion, Turno } from '../../catalogos';
import { Docentes } from '../../docentes/docentes.entity';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity.';
import { GruposConEstudiantes } from '../entities/gruposConEstudiantes.entity';

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
  @IsObject()
  docente?: Docentes;

  @IsObject()
  @IsOptional()
  organizacionEscolar?: OrganizacionEscolar;

  @IsObject()
  @IsOptional()
  grupoConEstudiantes?: GruposConEstudiantes;

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
