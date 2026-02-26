import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class StudentsDto {
    @IsOptional()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly studentCode: string;

    @IsOptional()
    @IsString()
    @MaxLength(16)
    @MinLength(14)
    @Transform(({ value }) => value === "" ? null : value)
    readonly identityCard: string;

    @IsNotEmpty()
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

    @IsNotEmpty()
    @IsString()
    readonly tutorName: string;

    @IsOptional()
    @IsString()
    @MaxLength(16)
    @MinLength(14)
    readonly tutorIdentityCard: string;

    @IsOptional()
    @IsNumber()
    @MaxLength(8)
    @MinLength(8)
    readonly tutorPhoneNumber: string;

    @IsOptional()
    @IsString()
    readonly observations: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @IsString()
    @MaxLength(8)
    @MinLength(8)
    readonly phone?: string;

    @IsInt()
    @IsOptional()
    user_create_id?: number;

    @IsInt()
    @IsOptional()
    user_update_id?: number;
}
