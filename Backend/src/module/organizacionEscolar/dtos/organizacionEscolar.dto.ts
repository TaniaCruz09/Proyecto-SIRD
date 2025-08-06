import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Grupos } from '../entities/grupos.entity';
import { AnioLectivo } from '../../catalogos/entities/anioLectivo.entity';
import { Docentes } from '../../docentes/docentes.entity';
import { Asignatura } from '../../catalogos';
import { Cortes } from 'src/module/catalogos/entities/corte.entity';

export class CreateOrganizacionEscolarDTO {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsObject()
  @Type(() => AnioLectivo)
  anio_lectivo: AnioLectivo;

  @IsNotEmpty()
  @IsObject()
  @Type(() => Grupos)
  grupo: Grupos;

  @IsNotEmpty()
  @IsObject()
  @Type(() => Docentes)
  docenteGuia: Docentes;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Docentes)
  docentes: Docentes[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Asignatura)
  asignaturas: Asignatura[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Cortes)
  cortes: Cortes[];

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
