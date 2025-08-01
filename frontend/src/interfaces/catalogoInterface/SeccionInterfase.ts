import { Grupos } from "./GruposInterface"

export interface Seccion {
    id: number,
    seccion: string,
    grado?: Grupos
}

export interface SeccionPayload {
    seccion: string,
    grado?: Grupos
}