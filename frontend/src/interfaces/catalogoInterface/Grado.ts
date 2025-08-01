import { Grupos } from "./GruposInterface"

export interface Grado {
    id: number,
    grades: string,
    grupos?:Grupos
}

export interface GradoPayload {
    grades: string
}