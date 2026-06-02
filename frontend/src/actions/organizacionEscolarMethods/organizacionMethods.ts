import { GrupoEscolarPayload, OrganizacionEscolarPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getOrganizacionEscolar() {
    const endPoint = `/organizacionEscolar`;

    const response = await feching(endPoint, "no-cache", "GET");
    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener la organizacion escolar");
    }
    console.log("📦 Esta es la respuesta completa del backend:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data

}

export async function getOrganizacionEscolarById(id: number) {
    const endPoint = `/organizacionEscolar/${id}`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener la organizacion escolar");
    }

    return response.data
}

export async function saveOrganizacionEscolar(organizacionEscolar: OrganizacionEscolarPayload) {
    const endPoint = `/organizacionEscolar`;

    const response = await feching(endPoint, "no-cache", "POST", organizacionEscolar);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al enviar la organizacion escolar");
    }

    return response.data
}

export async function updateOrganizacionEscolar(id: number, organizacionEscolar: OrganizacionEscolarPayload) {
    const endPoint = `/organizacionEscolar/${id}`;

    const response = await feching(endPoint, "no-cache", "PUT", organizacionEscolar);

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al actualizar la organizacion escolar");
    }

    return response.data
}

export async function deleteOrganizacionEscolar(id: number) {
    const endPoint = `/organizacionEscolar/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al eliminar la organizacion escolar");
    }

    return response.data
}