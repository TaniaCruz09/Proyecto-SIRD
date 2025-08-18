import { Docente } from "../DocenteInterface";
import { AnioLectivo } from "../organizacionEscolarInterface/AnioLectivo";
import { Grado } from "./Grado";
import { Modalidad } from "./ModalidadInterface";
import { Seccion } from "./SeccionInterfase";
import { Turno } from "./TurnoInterface";

export interface Grupos {
    id: number, 
    grado?: Grado,
    seccion?: Seccion,
    modalidad?: Modalidad,
    turno?: Turno,
    docente?: Docente,
    organizacionEscolar?: AnioLectivo, 
}