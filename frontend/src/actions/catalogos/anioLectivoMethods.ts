import { AnioLectivoPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getAniosLectivos() {
    const endpoint = `/anioLectivo`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function getAnioLectivoById(id: number) {
    const endpoint = `/anioLectivo/${id}`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveAnioLectivo(anio_lectivo: AnioLectivoPayload) {
    const endpoint = `/anioLectivo`

    const response = await feching(endpoint, "no-cache", "POST", anio_lectivo);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateAnioLectivo(id: number, anio_lectivo: AnioLectivoPayload) {
    const endpoint = `/anioLectivo/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", anio_lectivo);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteAnioLectivo(id: number) {
    const endpoint = `/anioLectivo/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}