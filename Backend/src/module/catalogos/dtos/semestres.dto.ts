import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Cortes } from '../entities/corte.entity';

export class SemestreDto {
  @IsNumber()
  @IsOptional()
  readonly id: number;

  @IsString()
  @MaxLength(30)
  abreviatura: string;

  @IsString()
  @MaxLength(30)
  semestre: string;

  @IsObject()
  @IsOptional()
  corte?: Cortes[];

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
