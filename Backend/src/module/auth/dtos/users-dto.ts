
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UsersDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly id?: number;

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

  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number], required: false })
  readonly roles?: number[];
}

export class UserPartialTypeDto extends PartialType(UsersDto) {}
