import { CortePayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getCortesEvaluativos() {
    const endpoint = `/cortes`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener los cortes evaluativos");

    } return response.data
}

export async function saveCorteEvaluativo(corte: CortePayload) {
    const endpoint = `/cortes`

    const response = await feching(endpoint, "no-cache", "POST", corte);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al agregar");

    } return response.data
}

export async function updateCorteEvaluativo(id: number, corte: CortePayload) {
    const endpoint = `/cortes/${id}`;

    const response = await feching(endpoint, "no-cache", "PUT", corte);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al actualizar");

    } return response.data
}

export async function deleteCorteEvaluativo(id: number) {
    const endpoint = `/cortes/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}