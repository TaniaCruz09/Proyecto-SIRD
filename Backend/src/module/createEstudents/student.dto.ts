import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class StudentsDto {
    @IsOptional()
    @IsNumber()
    readonly id: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    readonly name: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    readonly lastName: string;

    @IsOptional()
    @IsString()
    readonly studentCode: string;

    @IsOptional()
    @IsString()
    readonly identityCard: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : null)
    readonly dateBirt: Date;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    pais: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    municipio: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? Number(value) : null)
    departamento?: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    gender: number;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    readonly address: string;

    @IsOptional()
    @IsString()
    readonly tutorName: string;

    @IsOptional()
    @IsString()
    @MaxLength(16)
    readonly tutorIdentityCard: string;

    @IsOptional()
    @IsString()
    @MaxLength(8)
    readonly tutorPhoneNumber: string;

    @IsOptional()
    @IsString()
    readonly observations: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsInt()
    @IsOptional()
    user_create_id?: number;

    @IsInt()
    @IsOptional()
    user_update_id?: number;
}
