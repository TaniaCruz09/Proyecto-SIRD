import { Grado } from "./GradoInterfase";
import { Seccion } from "./SeccionInterfase";

export interface Grupos {
    id: number, 
    anio_lectivo: number,
    grado?: Grado,
}