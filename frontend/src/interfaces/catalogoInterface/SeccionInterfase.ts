import { Grupos } from "./Grupos"

export interface Seccion {
    id: number,
    seccion: string,
    grupos?: Grupos
}

export interface SeccionPayload {
    seccion: string
}