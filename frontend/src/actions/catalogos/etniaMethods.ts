import { EtniaPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getEtnias() {
    const endpoint = `/etnia`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveEtnia(etnia:EtniaPayload) {
    const endpoint = `/etnia`

    const response = await feching(endpoint, "no-cache", "POST", etnia);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateEtnia (id:number, etnia:EtniaPayload){
 const endpoint = `/etnia/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", etnia);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteEtnia(id:number){
    const endpoint = `/etnia/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}