import RegisterEstudent from "../registerEstudentInterface";
import { GrupoEscolar } from "./grupoInterface";

export interface GrupoConEstudiante {
    id: number,
    grupo: GrupoEscolar,
    estudiante: RegisterEstudent,
}

export interface GrupoId {
    id: number;
}

export interface GrupoConEstudiantePayload {
    grupo: { id: number }
    estudiante: { id: number };
}
