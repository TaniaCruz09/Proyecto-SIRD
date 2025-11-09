import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
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
import { Type } from 'class-transformer';

export class UpdateDocentesDTO {
  // @IsOptional()
  // @IsNumber()
  // readonly id?: number; ya biene dentro del body 

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombres?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellido_materno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  cedula_identidad?: string;

  @IsOptional()
  // @IsObject()
  @IsNumber()
  sexo?: Number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  nivel_academico?: AcademicLevelEntity[];
  // nivel_academico?: number[]; // ✅ Array de IDs

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  profession?: ProfessionsEntity[];
  // profession?: number[]; // ✅ Array de IDs

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  grupos?: Grupos[];
  // grupos?: number[]; // ✅ Array de IDs

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @Type(() => Date) // 👈 convierte strings a Date automáticamente
  @IsDate()
  fecha_nacimiento?: Date;

  @IsOptional()
  // @IsObject()
  // pais?: Pais;
  @IsNumber()
  pais?: number; // ✅ Solo el id

  // @IsNotEmpty()
  // @IsObject()
  // departamento: Departamento;

  @IsOptional()
  // @IsObject()
  // municipio?: Municipio;
   @IsNumber()
  municipio?: number; // ✅ Solo el id
  
  @IsOptional()
  @IsString()
  direccion_domiciliar?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaContratado?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre_contacto_emergencia?: string;

  @IsOptional()
  @IsString()
  telefono_contacto_emergencia?: string;

  //
  @IsOptional()
  @IsString()
  cargo_nominal?: string;

  @IsOptional()
  @IsString()
  cargo_real?: string;

  @IsOptional()
  @IsString()
  unidad_administrativa?: string;

  @IsOptional()
  @IsString()
  foto_docente?: string;

  @IsOptional()
  @IsNumber()
  user_create_id?: number;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  update_at?: Date;

  @IsOptional()
  @IsNumber()
  user_update_id?: number;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;

  @IsOptional()
  @IsNumber()
  deleted_at_id?: number;
}
