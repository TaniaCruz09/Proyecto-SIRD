export interface CorteResumen {
    id: number
    corte: string
    abreviatura: string
    orden: number
}

export interface PeriodoResumen {
    id: number
    nombre: string
    orden: number
    cortes: number[]
}

export interface NotaCalculada {
    cuant: number
    cual: string
    cualitativaId: number | null
}

export interface CorteCalificado extends NotaCalculada {
    corteId: number
    registrado: boolean
}

export interface PeriodoCalificado extends NotaCalculada {
    periodoId: number
    nombre: string
    orden: number
    cortes: number[]
}

export interface AsignaturaCalificada {
    asignaturaId: number
    asignatura: string
    docente: string | null
    cortes: CorteCalificado[]
    periodos: PeriodoCalificado[]
    final: NotaCalculada
}

export interface EstudianteCalificado {
    id: number
    name: string
    lastName?: string
    studentCode: string
    profileImage?: string | null
    gender?: string | null
    activoEnGrupo: boolean
    asignaturas: AsignaturaCalificada[]
    promedioGeneral: NotaCalculada
}

export interface GrupoResumen {
    id: number
    grado: string
    seccion: string
    turno: string
    modalidad: string
    anioLectivo: string | number
    docenteGuia: string
}

export interface EsquelaResumen {
    esquelaHeadId: number
    grupo: GrupoResumen
    cortes: CorteResumen[]
    periodos: PeriodoResumen[]
    asignaturas: Array<{ id: number; asignatura: string; docente: string | null }>
    estudiantes: EstudianteCalificado[]
}
