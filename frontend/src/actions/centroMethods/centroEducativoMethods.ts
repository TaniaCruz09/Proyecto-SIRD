import { CentroEscolarPayload } from "@/interfaces/centroInterface";
import { feching } from "@/utils/cliente-http"

export async function getCentros() {
    const endpoint = `/centro`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveCentros(centro:CentroEscolarPayload) {
    const endpoint = `/centro`

    const response = await feching(endpoint, "no-cache", "POST", centro);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateCentros (id:number, centro:CentroEscolarPayload){
 const endpoint = `/centro/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", centro);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteCentro(id:number){
    const endpoint = `/centro/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}