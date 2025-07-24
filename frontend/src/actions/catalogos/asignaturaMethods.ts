import { AsignaturaPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getAsignaturas() {
    const endpoint = `/asignatura`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener modalidad");

    } return response.data
}

export async function saveAsignatura(asignatura:AsignaturaPayload) {
    const endpoint = `/asignatura`

    const response = await feching(endpoint, "no-cache", "POST", asignatura);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener modalidad");

    } return response.data
}

export async function updateAsignatura (id:number, asignatura:AsignaturaPayload){
 const endpoint = `/asignatura/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", asignatura);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener modalidad");

    } return response.data
}

export async function deleteAsignatura(id:number){
    const endpoint = `/asignatura/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener modalidad");

    } return response.data
}