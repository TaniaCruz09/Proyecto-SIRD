import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Departamento, Municipio } from "../../catalogos";

export class UpdateCentroDto {
    @IsNumber()
    @IsOptional()
    readonly id?: number;

    @IsOptional()
    @IsString()
    nombreCentro?: string;

    @IsOptional()
    @IsString()
    codigoEstablecimiento?: string;

    @IsOptional()
    @IsString()
    codigoCentro?: string;

    @IsOptional()
    @IsString()
    direccionCentro?: string;

    // @IsOptional()
    // @IsObject()
    // departamento?: Departamento;

    @IsOptional()
    @IsObject()
    municipio?: Municipio;

    @IsOptional()
    @IsNumber()
    user_created_id?: number;

    @IsOptional()
    @IsDate()
    created_at?: Date

    @IsOptional()
    @IsDate()
    update_at?: Date

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
