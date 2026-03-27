import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { OrganizacionEscolar } from 'src/module/organizacionEscolar/entities/organizacionEscolar.entity';

class CorteRefDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

class PeriodoCorteRefDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsNumber()
    orden?: number;
}

class PeriodoLectivoDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsNumber()
    orden: number;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    abreviatura?: string;

    @IsOptional()
    @IsString()
    tipo?: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PeriodoCorteRefDto)
    cortes?: PeriodoCorteRefDto[];
}

export class CreateAnioLectivoDTO {
    @IsOptional()
    @IsNumber()
    readonly id?: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1000)
    @Max(9999)
    anio_lectivo: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => OrganizacionEscolar)
    organizacionEscolar?: OrganizacionEscolar[]

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CorteRefDto)
    cortes?: CorteRefDto[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PeriodoLectivoDto)
    periodos?: PeriodoLectivoDto[];

    @IsOptional()
    @IsString()
    tipo_periodizacion?: string;

    @IsOptional()
    @IsNumber()
    cantidad_periodos?: number;

    @IsOptional()
    @IsNumber()
    cantidad_cortes?: number;

    @IsOptional()
    @IsNumber()
    user_create_id: number;

    @IsOptional()
    @IsDate()
    created_at: Date;

    @IsOptional()
    @IsDate()
    update_at: Date;

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
