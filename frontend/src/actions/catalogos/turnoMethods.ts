import { TurnoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getTurnos() {
    const endpoint = `/turno`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveTurno(turno: TurnoPayload) {
    const endpoint = `/turno`

    const response = await feching(endpoint, "no-cache", "POST", turno);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateTurno (id:number, turno: TurnoPayload){
 const endpoint = `/turno/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", turno);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteTurno(id:number){
    const endpoint = `/turno/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}