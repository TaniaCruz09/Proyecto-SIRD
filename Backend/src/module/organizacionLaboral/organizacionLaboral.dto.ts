import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";
import { Docentes } from "../docentes/docentes.entity";
import { Asignatura } from "../catalogos/entities/asignatura.entity";
import { OrganizacionEscolar } from "../organizacionEscolar/entities/organizacionEscolar.entity";
import { Grupos } from "../organizacionEscolar/entities/grupos.entity";

export class OrganizacionLaboralDTO{
    @IsOptional()
    @IsNumber()
    readonly id?: number;
    
    @IsNotEmpty()
    @IsObject()
    docente: Docentes;
    
    @IsNotEmpty()
    @IsObject()
    añolectivo: OrganizacionEscolar;
    
    // @IsNotEmpty()
    // @IsObject()
    // asignatura: Asignatura;
    
    // @IsNotEmpty()
    // @IsArray()
    // grupos: Grupos[];

    @IsNotEmpty()
    @IsObject()
    grupoGuia: Grupos;
    
    @IsOptional()
    @IsNumber()
    user_create_id?: number;
    
    @IsOptional()
    @IsDate()
    created_at?: Date;
    
    @IsOptional()
    @IsDate()
    update_at?: Date;
    
    @IsOptional()
    @IsNumber()
    user_update_id?: number;
    
    @IsOptional()
    @IsDate()
    deleted_at?: Date;
    
    @IsOptional()
    @IsNumber()
    deleted_at_id?: number;
}