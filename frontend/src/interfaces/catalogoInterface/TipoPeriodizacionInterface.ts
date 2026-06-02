export interface TipoPeriodizacion {
  id: number;
  nombre: string;
  cantidad_periodos: number;
  prefijo_abreviatura?: string;
  isActive?: boolean;
}

export interface TipoPeriodizacionPayload {
  nombre: string;
  cantidad_periodos: number;
  prefijo_abreviatura?: string;
  isActive?: boolean;
}
