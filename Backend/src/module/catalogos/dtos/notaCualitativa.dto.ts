import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class NotaCualitativaDto {
  @IsNumber()
  @IsOptional()
  readonly id: number;

  @IsString()
  @MaxLength(100)
  readonly nombre: string;

  @IsString()
  @MaxLength(20)
  readonly abreviatura: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rango_menor: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  rango_mayor: number;

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
