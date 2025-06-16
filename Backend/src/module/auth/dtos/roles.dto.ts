import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
  } from 'class-validator';
  
  export class RoleDto {
    @IsOptional()
    @IsNumber()
    id: number;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    rol: string;
  
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
  }
  