import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Departamento, Municipio } from "../../catalogos";

export class CreateCentroDto {
    @IsNumber()
    @IsOptional()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    nombreCentro: string;

    @IsNotEmpty()
    @IsString()
    codigoEstablecimiento: string;

    @IsNotEmpty()
    @IsString()
    codigoCentro: string;

    @IsNotEmpty()
    @IsString()
    direccionCentro: string;

    // @IsNotEmpty()
    // @IsObject()
    // departamento: Departamento;

    @IsNotEmpty()
    @IsObject()
    municipio: Municipio;

    @IsOptional()
    @IsNumber()
    user_created_id: number;

    @IsOptional()
    @IsDate()
    created_at: Date

    @IsOptional()
    @IsDate()
    update_at: Date

    @IsOptional()
    @IsNumber()
    user_update_id: number;

    @IsOptional()
    @IsDate()
    deleted_at: Date;

    @IsOptional()
    @IsNumber()
    deleted_at_id: number;
} 
