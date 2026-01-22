import { CentroEscolarPayload } from "@/interfaces/centroInterface";
import { feching } from "@/utils/cliente-http"

export interface CentroEscolarCreatePayload {
    nombreCentro: string;
    codigoEstablecimiento: string;
    codigoCentro: string;
    direccionCentro: string;
    municipio: {
        id: number;
    };
}

export async function getCentros() {
    const endpoint = `/centro`

    const response = await feching(endpoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener");

    } return response.data
}

export async function saveCentros(
    centro: CentroEscolarCreatePayload
) {
    const endpoint = `/centro`;
    return feching(endpoint, "no-cache", "POST", centro);
}

export async function updateCentros(
    id: number,
    centro: CentroEscolarCreatePayload
) {
    const endpoint = `/centro/${id}`;
    return feching(endpoint, "no-cache", "PUT", centro);
}

export async function deleteCentro(id: number) {
    const endpoint = `/centro/${id}`;

    const response = await feching(endpoint, "no-cache", "DELETE");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al eliminar");

    } return response.data
}