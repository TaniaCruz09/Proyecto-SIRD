
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Docentes } from 'src/module/docentes/docentes.entity';

export class UsersDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly id?: number;

  @IsOptional()
  @IsObject()
  docente: Docentes;

  @ValidateIf((o) => !o.docente) // Solo se valida si no hay docente
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  @ApiProperty()
  readonly token: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly isActive?: boolean;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number], required: false })
  readonly roles?: number[];
}

export class UserPartialTypeDto extends PartialType(UsersDto) { }
