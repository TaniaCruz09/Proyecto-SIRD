import { IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { StudentEntity } from "src/module/createEstudents/students.entity";
import { GrupoAsignaturaDocente } from "../entities/GrupoAsignaturaDocente.entity";

export class AsignarEstudianteAGrupoDto {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsObject()
  estudiante: StudentEntity;

  @IsNotEmpty()
  @IsObject()
  grupoAsignaturaDocente: GrupoAsignaturaDocente;

  @IsOptional()
  @IsNumber()
  user_create_id?: number;
}
