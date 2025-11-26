import { EsquelaRowPayload } from "@/interfaces/calificaciones/EsquelaRow";
import { feching } from "@/utils/cliente-http"

export async function getEsquelaRow() {
    const endPoint = `/esquela_row`
    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener una esquela row");
    }

    return response.data
}

export async function getEsquelaRowById(id: number) {
    const endPoint = `/esquela_row/${id}`;
    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de obtener una esquela row")
    }

    return response.data;
}


export async function saveEsquelaRow(esquelaRow: EsquelaRowPayload) {
    const endPoint = `/esquela_row`;
    const response = await feching(endPoint, "no-cache", "POST", esquelaRow)

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de agregar una esquela row")
    }

    return response.data;
}

export async function updateEsquelaRow(id: number, esquelaRow: EsquelaRowPayload) {
    const endPoint = `/esquela_row/${id}`;
    const response = await feching(endPoint, "no-cache", "PUT", esquelaRow);
    if (!response || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de actualizar una esquela row")
    }

    return response.data;
}

export async function deleteEsquelaRow(id: number) {
    const endPoint = `/esquela_row/${id}`;
    const response = await feching(endPoint, "no-cache", "DELETE")

    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}
