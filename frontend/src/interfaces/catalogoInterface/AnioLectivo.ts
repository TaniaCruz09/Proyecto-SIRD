
import { OrganizacionEscolar } from "../organizacionEscolarInterface/organizacionInterface";
import { Corte } from "./corteEvaluativoInterface";


export interface AnioLectivo {
    id: number,
    anio_lectivo: number,
    isActive: boolean,
    created_at?: Date,
    organizacionEscolar: OrganizacionEscolar[],
    cortes?: Corte[],
    cortesAnioLectivo?: { corte: Corte }[],

}

export interface AnioLectivoPayload {
    anio_lectivo?: number,
    isActive?: boolean,
    created_at?: Date,
    organizacionEscolar?: OrganizacionEscolar[],
    cortes?: { id: number }[],
}