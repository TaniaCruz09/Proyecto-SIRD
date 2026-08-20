import { IsNotEmpty, IsNumber, IsObject, IsOptional, Max, Min } from "class-validator";
import { Asignatura } from "src/module/catalogos/entities/asignatura.entity";
import { Cortes } from "src/module/catalogos/entities/corte.entity";
import { NotaCualitativa } from "src/module/catalogos/entities/notaCualitativa.entity";
import { StudentEntity } from "src/module/createEstudents/students.entity";
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
    @IsObject()
    notaCualitativa: NotaCualitativa;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    notaCuantitativa: number

    @IsNotEmpty()
    corte: Cortes;

    @IsNotEmpty()
    @IsObject()
    esquelaHead: EsquelaHeadEntity;
}
