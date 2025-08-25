// src/module/organizacionEscolar/dtos/organizacionEscolarAsignatura.dto.ts
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class AsignaturaConDocenteDto {
  @IsNotEmpty()
  @IsNumber()
  asignaturaId: number;

  @IsNotEmpty()
  @IsNumber()
  docenteId: number;
}

export class CrearGrupoAsignaturaDocenteDto {
  @IsNotEmpty()
  @IsNumber()
  grupoId: number;

  @IsArray()
  asignaturasConDocentes: AsignaturaConDocenteDto[];
}
