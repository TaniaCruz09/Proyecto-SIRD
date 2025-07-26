import { Grupos } from "./Grupos"

export interface Grado {
    id: number,
    grades: string,
    grupos?:Grupos
}

export interface GradoPayload {
    grades: string
}