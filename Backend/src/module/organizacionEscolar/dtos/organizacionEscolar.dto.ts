import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
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

  @IsNotEmpty()
  @IsObject()
  corte: { id: number };

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
