import { GrupoEscolar } from "./grupoInterface";

export interface AnioLectivo {
    id: number,
    anio_lectivo: number,
    grupo?: GrupoEscolar,

}

export interface AnioLectivoPayload {
    anio_lectivo: number,
    grupo?: GrupoEscolar,
}