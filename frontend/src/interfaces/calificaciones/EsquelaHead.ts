import { GrupoEscolar } from "../organizacionEscolarInterface/grupoInterface";

export interface EsquelaHeadInterface {
    id: number,
    grupo_asignatura: GrupoEscolar,
}

export interface EsquelaHeadPayload {
    grupo_asignatura?: {
        id: number
    }
}