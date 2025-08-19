// import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";

// export class GrupoAsignaturasDto {
//     @IsNotEmpty()
//     @IsNumber()
//     grupoId: number;

//     @IsArray()
//     @IsNotEmpty({ each: true })
//     asignaturasIds: number[];
// }


// export class OrganizacionLaboralAsignaturaGrupoDto {
//   @IsOptional()
//   @IsNumber()
//   id: number;

//   @IsNotEmpty()
//   @IsNumber()
//   organizacionLaboralId: number;

//   @IsArray()
//   @IsNotEmpty({ each: true })
//   grupos: GrupoAsignaturasDto[];

//   @IsOptional()
//   @IsNumber()
//   user_create_id?: number;

//   @IsOptional()
//   @IsDate()
//   created_at?: Date;

//   @IsOptional()
//   @IsDate()
//   update_at?: Date;

//   @IsOptional()
//   @IsNumber()
//   user_update_id?: number;

//   @IsOptional()
//   @IsDate()
//   deleted_at?: Date;

//   @IsOptional()
//   @IsNumber()
//   deleted_at_id?: number;
// }
