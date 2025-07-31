import { Grado } from "../catalogoInterface/GradoInterfase";
import { Modalidad } from "../catalogoInterface/ModalidadInterface";
import { Seccion } from "../catalogoInterface/SeccionInterfase";
import { Turno } from "../catalogoInterface/TurnoInterface";
import { Docente } from "../DocenteInterface";
import { AnioLectivo } from "./AnioLectivo";

export interface GrupoEscolar {
    id: number,
    grado: Grado,
    seccion: Seccion,
    modalidad: Modalidad,
    turno: Turno,
    docente: Docente,
    organizacionEscolar: AnioLectivo,
    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}

export interface GrupoEscolarPayload {
    grado: Grado,
    seccion: Seccion,
    modalidad: Modalidad,
    turno: Turno,
    docente: Docente,
    organizacionEscolar: AnioLectivo,
    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}