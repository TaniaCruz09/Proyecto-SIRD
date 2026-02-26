
import { Municipio } from "./catalogoInterface/MunicipioInterface";
import { NivelAcademico } from "./catalogoInterface/NivelAcademicoInterface";
import { Pais } from "./catalogoInterface/PaisInterface";
import { Profesion } from "./catalogoInterface/ProfesionInterface";
import { Sexo } from "./catalogoInterface/SexoInterface";

export interface Docente {
  id: number,
  nombres: string,
  apellido_paterno: string,
  apellido_materno: string,
  cedula_identidad: string,
  telefono: string,
  fecha_nacimiento: Date,
  direccion_domiciliar: string,
  fechaContratado: Date,
  nombre_contacto_emergencia: string,
  telefono_contacto_emergencia: string,
  unidad_administrativa?: string,
  cargo_nominal?: string,
  cargo_real?: string,
  foto_docente?: string,
  correo?: string,
  sexo: Sexo,
  nivel_academico: NivelAcademico[],
  profession: Profesion[],
  pais: Pais,
  municipio: Municipio,
  user_create_id?: number | null;
  created_at?: string;
  update_at?: string;
  user_update_id?: number | null;
  deleted_at?: string | null;
  deleted_at_id?: number | null;
}

export interface DocentePayload {
  nombres?: string,
  apellido_paterno?: string,
  apellido_materno?: string,
  cedula_identidad?: string,
  telefono?: string,
  fecha_nacimiento?: Date,
  direccion_domiciliar?: string,
  fechaContratado?: Date,
  nombre_contacto_emergencia?: string,
  telefono_contacto_emergencia?: string,
  unidad_administrativa?: string,
  cargo_nominal?: string,
  cargo_real?: string,
  foto_docente?: string,
  sexo?: Sexo,
  nivel_academico?: NivelAcademico[],
  profession?: Profesion[],
  pais?: Pais,
  municipio?: Municipio,
  user_create_id?: number | null;
  created_at?: string;
  update_at?: string;
  user_update_id?: number | null;
  deleted_at?: string | null;
  deleted_at_id?: number | null;
}