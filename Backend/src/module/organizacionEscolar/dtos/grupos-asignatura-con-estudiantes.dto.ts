import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";
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

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class ActualizarEstadoEstudianteGrupoDto {
  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;
}
