import { AnioLectivoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getAniosLectivos() {
    const endpoint = `/organizacionEscolar`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveAnioLectivo(anioLectivo: AnioLectivoPayload) {
    const endpoint = `/organizacionEscolar`

    const response = await feching(endpoint, "no-cache", "POST", anioLectivo);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateAnioLectivo (id:number, anioLectivo: AnioLectivoPayload){
 const endpoint = `/organizacionEscolar/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", anioLectivo);

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteAnioLectivo(id:number){
    const endpoint = `/organizacionEscolar/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error ) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}