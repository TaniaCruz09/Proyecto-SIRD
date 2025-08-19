import { GrupoEscolar } from "../organizacionEscolarInterface/grupoInterface"


export interface Grado {
    id: number,
    grades: string,
    grupos?: GrupoEscolar
}

export interface GradoPayload {
    grades?: string
    grupos?: GrupoEscolar
}