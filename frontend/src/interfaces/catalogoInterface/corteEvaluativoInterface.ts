export interface Corte {
    id: number,
    abreviatura: string,
    corte: string,
    orden?: number,
}

export interface CortePayload {
    abreviatura: string,
    corte: string,
}