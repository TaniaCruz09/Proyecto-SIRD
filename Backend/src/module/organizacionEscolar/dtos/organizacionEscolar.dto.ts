import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
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
  @Type(() => AnioLectivo)
  anio_lectivo: AnioLectivo;

  @IsNotEmpty()
  @IsObject()
  @Type(() => Turno)
  turno: Turno;

  @IsOptional()
  @IsObject()
  @Type(() => Grupos)
  grupo?: Grupos[];

  @IsObject()
  @IsNotEmpty()
  @Type(() => Cortes)
  corte: Cortes;

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
