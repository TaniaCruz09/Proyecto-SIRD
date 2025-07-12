import { Semestre } from "./SemestreInterface";

export interface Corte {
    id: number,
    abreviatura: string,
    corte: string,
    semestre: Semestre
}

export interface CortePayload {
    abreviatura: string,
    corte: string,
    semestre: Semestre
}