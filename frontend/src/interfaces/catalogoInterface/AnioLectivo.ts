
import { OrganizacionEscolar } from "../organizacionEscolarInterface/organizacionInterface";
import { Corte } from "./corteEvaluativoInterface";

export interface PeriodoLectivo {
    id?: number,
    tipo_periodizacion_id?: number,
    nombre: string,
    abreviatura?: string,
    tipo?: string,
    orden: number,
    cortes: Corte[],
}

export interface PeriodoLectivoPayload {
    id?: number,
    tipo_periodizacion_id?: number,
    nombre: string,
    abreviatura?: string,
    tipo?: string,
    orden: number,
    cortes: { id: number, orden?: number }[],
}

export interface AnioLectivo {
    id: number,
    anio_lectivo: number,
    isActive: boolean,
    created_at?: Date,
    organizacionEscolar: OrganizacionEscolar[],
    cortes?: Corte[],
    cortesAnioLectivo?: { corte: Corte }[],
    periodos?: PeriodoLectivo[],

}

export interface AnioLectivoPayload {
    anio_lectivo?: number,
    isActive?: boolean,
    created_at?: Date,
    organizacionEscolar?: OrganizacionEscolar[],
    cortes?: { id: number }[],
    periodos?: PeriodoLectivoPayload[],
    tipo_periodizacion?: string,
    tipo_periodizacion_id?: number,
    cantidad_periodos?: number,
    cantidad_cortes?: number,
}