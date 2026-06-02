import { NotaCualitativaPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getNotasCualitativas() {
  const endpoint = "/notaCualitativa";
  const response = await feching(endpoint, "no-cache", "GET");

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener las notas cualitativas");
  }

  return response.data;
}

export async function saveNotaCualitativa(payload: NotaCualitativaPayload) {
  const endpoint = "/notaCualitativa";
  const response = await feching(endpoint, "no-cache", "POST", payload);

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al agregar la nota cualitativa");
  }

  return response.data;
}

export async function updateNotaCualitativa(id: number, payload: NotaCualitativaPayload) {
  const endpoint = `/notaCualitativa/${id}`;
  const response = await feching(endpoint, "no-cache", "PUT", payload);

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al actualizar la nota cualitativa");
  }

  return response.data;
}

export async function deleteNotaCualitativa(id: number) {
  const endpoint = `/notaCualitativa/${id}`;
  const response = await feching(endpoint, "no-cache", "DELETE");

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al eliminar la nota cualitativa");
  }

  return response.data;
}
