export interface NotaCualitativa {
  id: number;
  nombre: string;
  abreviatura: string;
  rango_menor: number;
  rango_mayor: number;
}

export interface NotaCualitativaPayload {
  nombre: string;
  abreviatura: string;
  rango_menor: number;
  rango_mayor: number;
}
