import { Modalidad } from "./ModalidadInterface"

export interface Turno {
    id: number,
    turno: string
    modalidad?: Modalidad
}

export interface TurnoPayload {
    turno: string
    modalidad?: Modalidad
}