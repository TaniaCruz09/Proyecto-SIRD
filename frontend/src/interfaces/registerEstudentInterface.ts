import { Departamento } from "./catalogoInterface/DepartamentoInterface";
import { Municipio } from "./catalogoInterface/MunicipioInterface";
import { Pais } from "./catalogoInterface/PaisInterface";
import { Sexo } from "./catalogoInterface/SexoInterface";


export default interface RegisterEstudent {
    id?: number,
    name: string,
    lastName: string,
    studentCode: string,
    identityCard: string,
    dateBirt: Date,
    pais: Pais,
    departamento: Departamento,
    municipio: Municipio,
    address: string,
    tutorName: string,
    tutorIdentityCard: string,
    tutorPhoneNumber: string,
    gender: Sexo,
    observations: string

    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}
export interface RegisterEstudentPayload {
    id?: number,
    name: string,
    lastName: string,
    studentCode: string,
    identityCard: string,
    dateBirt: Date,
    pais: Pais,
    departamento: Departamento,
    municipio: Municipio,
    address: string,
    tutorName: string,
    tutorIdentityCard: string,
    tutorPhoneNumber: string,
    gender: Sexo,
    observations: string

    user_create_id?: number | null;
    created_at?: string;
    update_at?: string;
    user_update_id?: number | null;
    deleted_at?: string | null;
    deleted_at_id?: number | null;
}
