import { GrupoEscolarPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getGrupos() {
    const endPoint = `/grupos`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener Grupos Academicos");
    }

    return response.data
}

export async function saveGrupo(grupo: GrupoEscolarPayload) {
    const endPoint = `/grupos`;

    const response = await feching(endPoint, "no-cache", "POST", grupo);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al enviar el Grupo Academico");
    }

    return response.data
}

export async function updateGrupo(id: number, grupo: GrupoEscolarPayload) {
    const endPoint = `/grupos/${id}`;

    const response = await feching(endPoint, "no-cache", "PUT", grupo);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al actualizar el Grupo Academico");
    }

    return response.data
}

export async function deleteGrupo(id: number) {
    const endPoint = `/grupos/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al eliminar el Grupo Academico");
    }

    return response.data
}