export interface TipoPeriodizacion {
  id: number;
  codigo: string;
  nombre: string;
  cantidad_periodos: number;
  etiqueta_periodo?: string;
  prefijo_abreviatura?: string;
  isActive?: boolean;
}

export interface TipoPeriodizacionPayload {
  codigo: string;
  nombre: string;
  cantidad_periodos: number;
  etiqueta_periodo?: string;
  prefijo_abreviatura?: string;
  isActive?: boolean;
}
