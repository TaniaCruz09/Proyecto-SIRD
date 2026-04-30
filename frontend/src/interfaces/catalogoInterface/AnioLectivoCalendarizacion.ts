export interface AnioLectivoCalendarizacionItem {
  id: number | null;
  anio_lectivo_id: number;
  corte_id: number;
  corte: string | null;
  abreviatura: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  observacion: string | null;
  isActive: boolean;
}

export interface UpsertAnioLectivoCalendarizacionItemPayload {
  corte_id: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  observacion?: string | null;
}

export interface UpsertAnioLectivoCalendarizacionPayload {
  items: UpsertAnioLectivoCalendarizacionItemPayload[];
}