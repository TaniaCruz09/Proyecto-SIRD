import { Grupos } from "../catalogoInterface/Grupos";


export interface AnioLectivo {
    id: number,
    anio_lectivo: number,
    grupo?: Grupos,

}

export interface AnioLectivoPayload {
    anio_lectivo: number,
    grupo?: Grupos,
}