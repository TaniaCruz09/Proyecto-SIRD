import { IsOptional, IsString } from 'class-validator';

export class FiltrarEstudiantesDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    studentCode?: string;

    @IsOptional()
    @IsString()
    anioId?: string;
}
