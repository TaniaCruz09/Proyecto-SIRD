import { Asignatura } from "../catalogoInterface/AsignaturaInterface";
import { Corte } from "../catalogoInterface/corteEvaluativoInterface";
import RegisterEstudent from "../registerEstudentInterface";
import { EsquelaHeadInterface } from "./EsquelaHead";

export interface EsquelaRow {
    id: number,
    estudiante: RegisterEstudent,
    asignatura: Asignatura,
    notaCualitativa: string,
    notaCuantitativa: number,
    corte: Corte,
    esquelaHead: EsquelaHeadInterface
}

export interface EsquelaRowPayload {
    estudiante: { id: number };
    asignatura: { id: number };
    notaCualitativa?: string;
    notaCuantitativa?: number;
    corte: { id: number };
    esquelaHead: { id: number };
}