import { Asignatura } from "../catalogoInterface/AsignaturaInterface";
import { Docente } from "../DocenteInterface";
import { GrupoEscolar } from "./grupoInterface";

// Una asignatura con su docente asignado
export interface AsignaturaConDocente {
  asignaturaId: number;
  docenteId: number;
}

// Payload que se envía al backend
export interface GrupoConAsignaturasPayload {
  grupoId: number; // el id del grupo (no el objeto)
  asignaturasConDocentes: AsignaturaConDocente[];
}

// Lo que recibes del backend (incluye el id de la relación)
export interface GrupoConAsignaturasResponse {
  id: number; // id de la relación pivote
  grupo: GrupoEscolar; // el objeto grupo completo
  asignatura: Asignatura; // el objeto asignatura completo
  docente: Docente; // el objeto docente completo
}
