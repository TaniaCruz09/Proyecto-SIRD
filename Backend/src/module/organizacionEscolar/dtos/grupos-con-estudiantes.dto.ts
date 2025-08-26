import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";


export class CreateGruposConEstudiantesDto {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsObject()
  @IsNotEmpty()
  estudiante: { id: number };;

  @IsObject()
  @IsNotEmpty()
  grupo: { id: number };;

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
