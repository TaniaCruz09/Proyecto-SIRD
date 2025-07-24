import { Departamento } from "./DepartamentoInterface";
import { Municipio } from "./MunicipioInterface";
import { Pais } from "./PaisInterface";
import { Sexo } from "./SexoInterface";

export default interface RegisterEstudent{
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
}
