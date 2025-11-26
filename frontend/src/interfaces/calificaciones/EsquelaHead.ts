import { GrupoEscolar } from "../organizacionEscolarInterface/grupoInterface";

export interface EsquelaHead {
    id: number,
    grupo_asignatura: GrupoEscolar,
}

export interface EsquelaHeadPayload {
    grupo_asignatura?: {
        id: number
    }
}