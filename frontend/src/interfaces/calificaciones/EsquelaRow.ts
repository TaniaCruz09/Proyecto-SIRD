import { Asignatura } from "../catalogoInterface/AsignaturaInterface";
import { Corte } from "../catalogoInterface/corteEvaluativoInterface";
import RegisterEstudent from "../registerEstudentInterface";

export interface EsquelaRow {
    id: number,
    estudiante: RegisterEstudent,
    asignatura: Asignatura,
    notaCualitativa: string,
    notaCuantitativa: number,
    corte: Corte
}

export interface EsquelaRowPayload {
    estudiante?: RegisterEstudent,
    asignatura?: Asignatura,
    notaCualitativa?: string,
    notaCuantitativa?: number,
    corte?: Corte
}