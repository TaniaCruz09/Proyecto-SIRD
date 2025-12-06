
import { OrganizacionEscolar } from "../organizacionEscolarInterface/organizacionInterface";


export interface AnioLectivo {
    id: number,
    anio_lectivo: number,
    isActive: boolean,
    created_at?: Date,
    organizacionEscolar: OrganizacionEscolar[],

}

export interface AnioLectivoPayload {
    anio_lectivo?: number,
    isActive?: boolean,
    created_at?: Date,
    organizacionEscolar?: OrganizacionEscolar[],
}