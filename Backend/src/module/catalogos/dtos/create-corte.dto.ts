import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SemestreEntity } from '../entities/semestres.entity';

export class CreateCortesDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  // @MaxLength(30)
  abreviatura: string;

  @IsNotEmpty()
  @IsString()
  // @MaxLength(30)
  corte: string;

  @IsObject()
  @IsNotEmpty()
  semestre: SemestreEntity;

  @IsOptional()
  @IsNumber()
  user_create_id: number;

  @IsOptional()
  @IsDate()
  create_at: Date;

  @IsOptional()
  @IsDate()
  update_at: Date;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsNumber()
  user_update_id: number;

  @IsOptional()
  @IsDate()
  deleted_at: Date;
}
