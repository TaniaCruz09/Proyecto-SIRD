import { AnioLectivo } from "../catalogoInterface/AnioLectivo";
import { Turno } from "../catalogoInterface/TurnoInterface";
import { GrupoEscolar } from "./grupoInterface";

export interface OrganizacionEscolar {
    id: number,
    anio_lectivo: AnioLectivo,
    turno: Turno,
    grupos?: GrupoEscolar[],
}

export interface OrganizacionEscolarPayload {
    anio_lectivo: { id: number };
    turno: { id: number };
}