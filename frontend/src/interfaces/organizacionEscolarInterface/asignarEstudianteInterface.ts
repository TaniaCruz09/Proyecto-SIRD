import RegisterEstudent from "../registerEstudentInterface";
import { GrupoConAsignaturasResponse } from "./gruposConAsignaturas";

export interface GrupoConEstudiante {
    id: number,
    grupoAsignaturaDocente: GrupoConAsignaturasResponse,
    estudiante: RegisterEstudent,
}

export interface GrupoId {
    id: number;
}

export interface GrupoConEstudiantePayload {
    grupoAsignaturaDocente: { id: number }
    estudiante: { id: number };
}
