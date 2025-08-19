import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { StudentEntity } from '../../createEstudents';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';

export class CreateOrganizacionConEstudiantesDto {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsObject()
  organizacionEscolar: OrganizacionEscolar;

  @IsNotEmpty()
  @IsObject()
  estudiante: StudentEntity;

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
