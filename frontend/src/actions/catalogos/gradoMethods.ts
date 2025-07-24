import { GradoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getGrados() {
    const endpoint = `/grades`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveGrado(grado:GradoPayload) {
    const endpoint = `/grades`

    const response = await feching(endpoint, "no-cache", "POST", grado);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateGrado (id:number, grado:GradoPayload){
 const endpoint = `/grades/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", grado);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteGrado(id:number){
    const endpoint = `/grades/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}