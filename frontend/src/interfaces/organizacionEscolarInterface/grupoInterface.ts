import { Grado } from "../catalogoInterface/Grado";
import { Seccion } from "../catalogoInterface/SeccionInterfase";
import { Turno } from "../catalogoInterface/TurnoInterface";
import { Docente } from "../DocenteInterface";
import { OrganizacionEscolar } from "./organizacionInterface";
import { GrupoConAsignaturasResponse } from "./gruposConAsignaturas";

export interface GrupoEscolar {
    id: number,
    grado: Grado,
    seccion: Seccion,
    turno: Turno,
    organizacionEscolar: OrganizacionEscolar,
    docenteGuia: Docente,
    grupoAsignaturaDocente?: GrupoConAsignaturasResponse[]
    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}

export interface GrupoEscolarPayload {
    organizacionEscolar?: { id: number };
    grado?: { id: number };
    seccion?: { id: number };
    turno?: { id: number };
    docenteGuia?: { id: number };
}