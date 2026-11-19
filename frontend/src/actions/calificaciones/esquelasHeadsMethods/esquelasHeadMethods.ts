import { EsquelaHeadPayload } from "@/interfaces/calificaciones/EsquelaHead";
import { EsquelaResumen } from "@/interfaces/calificaciones/EsquelaResumen";
import { feching } from "@/utils/cliente-http"
import getHeadersGlobal from "@/utils/header-global"

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

export async function getEsquelaResumen(id: number): Promise<EsquelaResumen> {
    const endPoint = `/esquelas/${id}/resumen`;
    const response = await feching(endPoint, "no-cache", "GET");

    if (!response?.data || response.error) {
        throw new Error(response?.error || "Error al obtener el resumen de la esquela");
    }

    return response.data as EsquelaResumen;
}

export async function getEsquelaPdf(id: number, vista: string): Promise<Blob> {
    const response = await fetch(`/api/backend/esquelas/${id}/pdf?vista=${encodeURIComponent(vista)}`, {
        method: "GET",
        cache: "no-store",
        headers: getHeadersGlobal(),
        credentials: "include",
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? ""
        const errorBody = contentType.includes("application/json")
            ? await response.json()
            : await response.text()
        const message = typeof errorBody === "object" && errorBody !== null
            ? errorBody.message
            : errorBody
        throw new Error(
            typeof message === "string" && message
                ? message
                : `No fue posible generar el PDF (HTTP ${response.status})`,
        )
    }

    return response.blob();
}
