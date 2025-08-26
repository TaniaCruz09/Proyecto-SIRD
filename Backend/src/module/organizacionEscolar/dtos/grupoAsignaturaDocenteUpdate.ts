// src/module/organizacionEscolar/dtos/grupoAsignaturaDocenteUpdate.ts
import { IsOptional, IsNumber, IsArray } from "class-validator";

export class ActualizarGrupoAsignaturaDocenteItemDto {
  @IsOptional()
  @IsNumber()
  asignaturaId?: number;

  @IsOptional()
  @IsNumber()
  docenteId?: number;
}

export class ActualizarGrupoAsignaturaDocenteDto {
  @IsOptional()
  @IsArray()
  asignaturasConDocentes?: ActualizarGrupoAsignaturaDocenteItemDto[];
}
