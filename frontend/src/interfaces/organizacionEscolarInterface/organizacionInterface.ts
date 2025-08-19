import { AnioLectivo } from "../catalogoInterface/AnioLectivo";
import { Asignatura } from "../catalogoInterface/AsignaturaInterface";
import { Corte } from "../catalogoInterface/corteEvaluativoInterface";
import { Modalidad } from "../catalogoInterface/ModalidadInterface";
import { Turno } from "../catalogoInterface/TurnoInterface";
import { Docente } from "../DocenteInterface";
import { GrupoEscolar } from "./grupoInterface";

export interface OrganizacionEscolar {
    id: number,
    anio_lectivo: AnioLectivo,
    turno: Turno,
    corte: Corte
    grupo?: GrupoEscolar,
}

export interface OrganizacionEscolarPayload {
    anio_lectivo: { id: number };
    turno: { id: number };
    corte: { id: number };
}