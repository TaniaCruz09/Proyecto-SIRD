import { Asignatura } from "./catalogoInterface/AsignaturaInterface";
import { Docente } from "./DocenteInterface";
import { AnioLectivo } from "./organizacionEscolarInterface/AnioLectivo";
import { GrupoEscolar } from "./organizacionEscolarInterface/grupoInterface";



export interface OrganizacionLaboral {
    id?: number;
    docente: Docente;
    añolectivo: AnioLectivo;
    grupoGuia: GrupoEscolar;
    user_create_id?:number | null;
    created_at?: string; // ISO date string
    update_at?: string; // ISO date string
    user_update_id?: number | null;
    deleted_at?: string | null; // ISO date string or null
    deleted_at_id?: number | null; // ID of the user who deleted the record
    
}
export interface OrganizacionLaboralPayload {
    docente: Docente;
    añolectivo: AnioLectivo; // Assuming OrganizacionEscolar type is defined elsewhere
    grupoGuia: GrupoEscolar;
    user_create_id?: number | null;
    created_at?: string; // ISO date string
    update_at?: string; // ISO date string
    user_update_id?: number | null
    deleted_at?: string | null; // ISO date string or null
    deleted_at_id?: number | null; // ID of the user who deleted the record
}