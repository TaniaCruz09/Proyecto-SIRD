import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { OrganizacionEscolar } from 'src/module/organizacionEscolar/entities/organizacionEscolar.entity';

class CorteRefDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class CreateAnioLectivoDTO {
    @IsOptional()
    @IsNumber()
    readonly id?: number;

    @IsNotEmpty()
    @IsNumber()
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
