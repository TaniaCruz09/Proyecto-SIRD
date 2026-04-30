import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpsertAnioLectivoCalendarizacionItemDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  corte_id: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string | null;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  observacion?: string | null;
}

export class UpsertAnioLectivoCalendarizacionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertAnioLectivoCalendarizacionItemDto)
  items: UpsertAnioLectivoCalendarizacionItemDto[];
}