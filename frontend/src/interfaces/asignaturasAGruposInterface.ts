import { Asignatura } from "./catalogoInterface/AsignaturaInterface";
import { GrupoEscolar } from "./organizacionEscolarInterface/grupoInterface";
import { OrganizacionLaboral } from "./organizacionLaboralInterface";


export interface AsignaturasGrupos{
    id?:number;
    organizacionLaboral: OrganizacionLaboral;
    grupo: GrupoEscolar[];
    asignatura: Asignatura[];
    user_create_id?: number | null;
    created_at?: string; // ISO date string
    update_at?: string; // ISO date string
    user_update_id?: number | null
    deleted_at?: string | null; // ISO date string or null
    deleted_at_id?: number | null; // ID of the user who deleted the record
}
export interface AsignaturasGruposPayload{
    organizacionLaboral: OrganizacionLaboral;
    grupo: GrupoEscolar[];
    asignatura: Asignatura[];
    user_create_id?: number | null;
    created_at?: string; // ISO date string
    update_at?: string; // ISO date string
    user_update_id?: number | null
    deleted_at?: string | null; // ISO date string or null
    deleted_at_id?: number | null; // ID of the user who deleted the record
}