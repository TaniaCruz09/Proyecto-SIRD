import { AnioLectivo } from "../catalogoInterface/AnioLectivo";
import { Asignatura } from "../catalogoInterface/AsignaturaInterface";
import { Corte } from "../catalogoInterface/corteEvaluativoInterface";
import { Docente } from "../DocenteInterface";
import { GrupoEscolar } from "./grupoInterface";

export interface OrganizacionEscolar {
    id: number,
    anio_lectivo: AnioLectivo,
    grupo: GrupoEscolar,
    docenteGuia: Docente,
    docentes: Docente[],
    asignaturas: Asignatura[],
    cortes: Corte[]
}

export interface OrganizacionEscolarPayload {
    anio_lectivo: AnioLectivo,
    grupo: GrupoEscolar,
    docenteGuia: Docente,
    docentes: Docente[],
    asignaturas: Asignatura[],
    cortes: Corte[]
}