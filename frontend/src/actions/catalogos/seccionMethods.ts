import { SeccionPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getSecciones() {
    const endpoint = `/seccion`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveSeccion(seccion:SeccionPayload) {
    const endpoint = `/seccion`

    const response = await feching(endpoint, "no-cache", "POST", seccion);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateSeccion (id:number, seccion:SeccionPayload){
 const endpoint = `/seccion/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", seccion);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteSeccion(id:number){
    const endpoint = `/seccion/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}