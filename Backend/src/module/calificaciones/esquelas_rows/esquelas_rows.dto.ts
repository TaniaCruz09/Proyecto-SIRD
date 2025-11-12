import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Asignatura, Cortes } from "src/module/catalogos";
import { StudentEntity } from "src/module/createEstudents";
import { EsquelaHeadEntity } from "../esquela_head/entities/squela_head.entity";

export class CreateEsquelaRowDto {
    @IsOptional()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsObject()
    estudiante: StudentEntity;

    @IsNotEmpty()
    @IsObject()
    asignatura: Asignatura;

    @IsNotEmpty()
    @IsString()
    notaCualitativa: string;

    @IsOptional()
    @IsNumber()
    notaCuantitativa: number

    @IsNotEmpty()
    corte: Cortes;

    @IsNotEmpty()
    @IsObject()
    esquelaHead: EsquelaHeadEntity;
}
