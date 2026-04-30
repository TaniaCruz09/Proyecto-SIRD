import {
  AnioLectivoCalendarizacionItem,
  UpsertAnioLectivoCalendarizacionPayload,
} from '@/interfaces';
import { feching } from '@/utils/cliente-http';

export async function getAnioLectivoCalendarizacion(anioLectivoId: number) {
  const endpoint = `/anio-lectivo-calendarizacion/anio-lectivo/${anioLectivoId}`;
  const response = await feching(endpoint, 'no-cache', 'GET');

  if (!response.data || response.error) {
    throw new Error(response?.error || 'Error al obtener la calendarizacion');
  }

  return response.data as AnioLectivoCalendarizacionItem[];
}

export async function upsertAnioLectivoCalendarizacion(
  anioLectivoId: number,
  payload: UpsertAnioLectivoCalendarizacionPayload,
) {
  const endpoint = `/anio-lectivo-calendarizacion/anio-lectivo/${anioLectivoId}`;
  const response = await feching(endpoint, 'no-cache', 'PUT', payload);

  if (!response.data || response.error) {
    throw new Error(response?.error || 'Error al guardar la calendarizacion');
  }

  return response.data as AnioLectivoCalendarizacionItem[];
}