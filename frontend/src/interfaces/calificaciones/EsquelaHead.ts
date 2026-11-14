import { GrupoEscolar } from "../organizacionEscolarInterface/grupoInterface";

export type CorteEstado = "open" | "future" | "closed" | "unconfigured"

export interface CorteEstadoAsignatura {
    completo: boolean
    secuenciaCompleta: boolean
    habilitado: boolean
    editable: boolean
    mensaje: string
}

export interface CorteEstadoItem {
    corteId: number
    nombre: string
    abreviatura: string | null
    orden: number
    estado: CorteEstado
    fechaInicio: string | null
    fechaFin: string | null
    rango: string
    /** El backend acepta notas en esta fecha (sin contar la secuencia) */
    editablePorFecha: boolean
    mensajeFecha: string
    porAsignatura: Record<string, CorteEstadoAsignatura>
}

export interface CortesEstado {
    anioActivo: boolean
    modalidadId: number | null
    hoy: string
    cortes: CorteEstadoItem[]
}

export interface EsquelaHeadInterface {
    id: number,
    grupo_asignatura: GrupoEscolar,
    esquelaRow?: EsquelaRowInterface[];   // fila opcional
    cortesEstado?: CortesEstado
}

export interface EsquelaHeadPayload {
    grupo_asignatura?: {
        id: number
    }
}

export interface EsquelaRowInterface {
    id: number;
    estudiante: { id: number };
    asignatura: { id: number };
    corte: { id: number };
    notaCuantitativa: number;
    notaCualitativa?: { id: number; nombre?: string; abreviatura?: string };
}