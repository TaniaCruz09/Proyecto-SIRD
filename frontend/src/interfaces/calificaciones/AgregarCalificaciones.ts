import { Corte } from "../catalogoInterface/corteEvaluativoInterface";

export interface Semestre {
    id: number;
    abreviatura: string;
    semestre: string;
}
export interface CorteEvaluativo {
    id: number;
    abreviatura: string;
    corte: string;
    create_at: string;
    update_at: string;
    semestre: Semestre;
}
export interface Estudiante {
    id: number
    codigo: string
    nombre: string
    apellido: string
    sexo: "M" | "F"
    foto?: string
    calificaciones: Record<
        number | string, // asignaturaId
        Record<
            number, // corteId
            string // nota
        >
    >
}

export interface Asignatura {
    id: number
    nombre: string
    codigo: string
}

export interface CorteUI extends Corte {
    color: string
}