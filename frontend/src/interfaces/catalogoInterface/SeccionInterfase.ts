import { GrupoEscolar } from "../organizacionEscolarInterface/grupoInterface"


export interface Seccion {
    id: number,
    seccion: string,
    grado?: GrupoEscolar
}

export interface SeccionPayload {
    seccion: string,
    grado?: GrupoEscolar
}