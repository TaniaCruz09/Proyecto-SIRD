import { Docente, DocentePayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http"

export async function getDocentes() {
    const endPoint = `/docentes`

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "Error al obtener docentes");
    }

    return response.data

}

export async function getDocenteById(id: number) {
    const endPoint = `/docentes/${id}`;

    const response = await feching(endPoint, "no-cache", "GET");

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de obtener un usuario")
    }

    return response.data;

}

export async function saveDocente(docente: DocentePayload) {
    const endPoint = `/docentes`;

    const response = await feching(endPoint, "no-cache", "POST", docente)

    if (!response.data || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de agragar docente")
    }

    return response.data;
}

export async function updateDocente(id: number, docente: DocentePayload) {
    const endPoint = `/docentes/${id}`;

    const response = await feching(endPoint, "no-cache", "PUT", docente);

    if (!response || response.error) {
        throw new Error(response?.error || "error desconocido desde el front de actualizar docente")
    }

    return response.data;
}

export async function deleteDocentes(id: number) {
    const endPoint = `/docentes/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE")

    if (!response.data || response.data.error) {
        throw new Error(response?.error)
    }

    return response.data
}
