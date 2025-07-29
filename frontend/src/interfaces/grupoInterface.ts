import { Grado } from "./catalogoInterface/GradoInterfase";
import { Modalidad } from "./catalogoInterface/ModalidadInterface";
import { Seccion } from "./catalogoInterface/SeccionInterfase";
import { Turno } from "./catalogoInterface/TurnoInterface";
import { Docente } from "./DocenteInterface";

export interface GrupoEscolar {
    id: number,
    gradoId: Grado,
    seccionId: Seccion,
    modalidadId: Modalidad,
    turnoId: Turno,
    docenteId: Docente,
    organizacionEscolarId: number,
    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}

export interface GrupoEscolarPayload {
    gradoId: Grado,
    seccionId: Seccion,
    modalidadId: Modalidad,
    turnoId: Turno,
    docenteId: Docente,
    organizacionEscolarId: number,
    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}