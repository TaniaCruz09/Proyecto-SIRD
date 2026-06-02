import { GrupoEscolar } from "../organizacionEscolarInterface/grupoInterface";

export interface EsquelaHeadInterface {
    id: number,
    grupo_asignatura: GrupoEscolar,
    esquelaRow?: EsquelaRowInterface[];   // fila opcional
}

export interface EsquelaHeadPayload {
    grupo_asignatura?: {
        id: number
    }
}

export interface EsquelaRowInterface {
    id: number;
    estudiante: { id: number };
    asignatura: { id: number };
    corte: { id: number };
    notaCuantitativa: number;
    notaCualitativa?: string;
}