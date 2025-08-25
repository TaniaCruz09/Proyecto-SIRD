// import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";
// import { Grupos } from "../entities/grupos.entity";
// import { Asignatura } from "src/module/catalogos";
// import { Docentes } from "src/module/docentes/docentes.entity";

// export class AsignaturaConDocenteDto{
//     @IsNotEmpty()
//     @IsNumber()
//     asignaturaId: number;

//     @IsNotEmpty()
//     @IsNumber()
//     docenteId: number;
// }

// export class OrganizacionEscolarConAsignaturaDto {
//     @IsOptional()
//     @IsNumber()
//     readonly id?: number;

//     @IsNotEmpty()
//     @IsObject()
//     grupo: Grupos;

//     @IsArray()
//     asignaturaConDocente: AsignaturaConDocenteDto[];

//     @IsNotEmpty()
//     @IsObject()
//     docente : Docentes;

//     @IsOptional()
//     @IsNumber()
//     user_create_id: number;

//     @IsOptional()
//     @IsDate()
//     created_at: Date;

//     @IsOptional()
//     @IsDate()
//     update_at: Date;

//     @IsOptional()
//     @IsNumber()
//     user_update_id: number;

//     @IsOptional()
//     @IsDate()
//     deleted_at: Date;

//     @IsOptional()
//     @IsNumber()
//     deleted_at_id: number;
// }