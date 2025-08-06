import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
} from 'class-validator';

export class CreateAnioLectivoDTO {
    @IsOptional()
    @IsNumber()
    readonly id?: number;

    @IsNotEmpty()
    @IsNumber()
    anio_lectivo: number;

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
