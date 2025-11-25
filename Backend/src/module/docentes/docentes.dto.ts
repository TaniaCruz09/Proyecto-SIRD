import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  AcademicLevelEntity,
  Departamento,
  GenderEntity,
  Municipio,
  Pais,
  ProfessionsEntity,
} from '../catalogos';
import { Grupos } from '../organizacionEscolar/entities/grupos.entity';

export class DocentesDTO {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombres: string;

  @IsOptional()
  @ValidateIf(o => !o.apellido_materno)
  @IsString()
  @MaxLength(50)
  apellido_paterno?: string;

  @IsOptional()
  @ValidateIf(o => !o.apellido_paterno)
  @IsString()
  @MaxLength(50)
  apellido_materno?: string;


  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(14)
  cedula_identidad: string;

  @IsNotEmpty()
  @IsObject()
  sexo: GenderEntity;

  @IsNotEmpty()
  @IsArray()
  nivel_academico: AcademicLevelEntity[];

  @IsNotEmpty()
  @IsArray()
  profession: ProfessionsEntity[];

  @IsOptional()
  @IsArray()
  grupos: Grupos[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  @MinLength(8)
  telefono: string;

  @IsNotEmpty()
  @IsDate()
  fecha_nacimiento: Date;

  @IsNotEmpty()
  @IsObject()
  pais: Pais;

  // @IsNotEmpty()
  // @IsObject()
  // departamento: Departamento;

  @IsNotEmpty()
  @IsObject()
  municipio: Municipio;

  @IsNotEmpty()
  @IsString()
  direccion_domiciliar: string;

  @IsNotEmpty()
  @IsDate()
  fechaContratado: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre_contacto_emergencia: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  @MinLength(8)
  telefono_contacto_emergencia: string;

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
