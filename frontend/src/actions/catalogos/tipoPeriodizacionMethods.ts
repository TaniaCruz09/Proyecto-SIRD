import { TipoPeriodizacionPayload } from "@/interfaces";
import { feching } from "@/utils/cliente-http";

export async function getTiposPeriodizacion() {
  const endpoint = `/tipo-periodizacion`;
  const response = await feching(endpoint, "no-cache", "GET");

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener tipos de periodizacion");
  }

  return response.data;
}

export async function saveTipoPeriodizacion(payload: TipoPeriodizacionPayload) {
  const endpoint = `/tipo-periodizacion`;
  const response = await feching(endpoint, "no-cache", "POST", payload);

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al agregar tipo de periodizacion");
  }

  return response.data;
}

export async function updateTipoPeriodizacion(id: number, payload: TipoPeriodizacionPayload) {
  const endpoint = `/tipo-periodizacion/${id}`;
  const response = await feching(endpoint, "no-cache", "PUT", payload);

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al actualizar tipo de periodizacion");
  }

  return response.data;
}

export async function deleteTipoPeriodizacion(id: number) {
  const endpoint = `/tipo-periodizacion/${id}`;
  const response = await feching(endpoint, "no-cache", "DELETE");

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al eliminar tipo de periodizacion");
  }

  return response.data;
}
