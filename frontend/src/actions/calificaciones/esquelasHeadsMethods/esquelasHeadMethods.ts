import { EsquelaHeadPayload } from "@/interfaces/calificaciones/EsquelaHead";
import { feching } from "@/utils/cliente-http"

export async function getEsquelaHead() {
    const endPoint = `/esquela_head`
    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener una esquela head");
    }

    return response.data
}

export async function getEsquelaByGrupo(id: number) {
    const endPoint = `/esquela_head/grupo/${id}`;
    try {
        const response = await feching(endPoint, "no-cache", "GET");
        // si no hay data, devolvemos null (no lanzar error)
        return response?.data || null;
    } catch (error) {
        console.error("Error en getEsquelaByGrupo:", error);
        return null; // en caso de error, asumimos que no hay esquela
    }
}

export async function getEsquelaHeadById(id: number) {
    const endPoint = `/esquela_head/${id}`;
    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de obtener una esquela head")
    }

    return response.data;
}


export async function saveEsquelaHead(esquelaHead: EsquelaHeadPayload) {
    const endPoint = `/esquela_head`;
    const response = await feching(endPoint, "no-cache", "POST", esquelaHead)

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de agregar una esquela head")
    }

    return response.data;
}

export async function updateEsquelaHead(id: number, esquelaHead: EsquelaHeadPayload) {
    const endPoint = `/esquela_head/${id}`;
    const response = await feching(endPoint, "no-cache", "PUT", esquelaHead);
    if (!response || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de actualizar una esquela head")
    }

    return response.data;
}

export async function deleteEsquelaHead(id: number) {
    const endPoint = `/esquela_head/${id}`;
    const response = await feching(endPoint, "no-cache", "DELETE")

    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}
