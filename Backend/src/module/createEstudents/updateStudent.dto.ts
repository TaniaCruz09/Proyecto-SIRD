import { IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, maxLength } from "class-validator";
import { Unique } from "typeorm";
import { Departamento, GenderEntity, Municipio, Pais } from "../catalogos";
import { Transform } from "class-transformer";


export class UpdateStudentsDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @Unique(['studentCode'])
    studentCode?: string;

    @IsOptional()
    @IsString()
    identityCard?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : null)
    dateBirt: Date;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    pais?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    municipio?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? Number(value) : null)
    departamento?: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    gender?: number;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    address?: string;

    @IsOptional()
    @IsString()
    tutorName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(16)
    tutorIdentityCard?: string;

    @IsOptional()
    @IsString()
    @MaxLength(8)
    tutorPhoneNumber?: string;

    @IsOptional()
    @IsString()
    observations?: string;

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