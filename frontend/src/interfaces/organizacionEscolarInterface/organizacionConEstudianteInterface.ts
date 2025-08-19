import RegisterEstudent from "../registerEstudentInterface";
import { OrganizacionEscolar } from "./organizacionInterface";

export interface OrganizacionEscolarConEstudiante {
    id: number,
    organizacionEscolar: OrganizacionEscolar,
    estudiante: RegisterEstudent,
}

interface OrganizacionEscolarId {
    id: number;
}

export interface OrganizacionEscolarConEstudiantePayload {
    organizacionEscolar: OrganizacionEscolarId;
    estudiante: { id: number };
}
