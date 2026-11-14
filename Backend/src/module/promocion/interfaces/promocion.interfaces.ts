/** Resumen de un grupo, con lo mínimo que necesita el frontend para mostrarlo. */
export interface GrupoResumen {
  id: number;
  label: string;
  gradoId: number | null;
  grado: string | null;
  ordenGrado: number | null;
  seccionId: number | null;
  seccion: string | null;
  turno: string | null;
  modalidad: string | null;
}

/** Grupo de origen con el total de estudiantes distintos inscritos. */
export interface GrupoConEstudiantes extends GrupoResumen {
  estudiantes: number;
}

export interface AnioLectivoResumen {
  id: number;
  anioLectivo: number;
  isActive: boolean;
  grupos: number;
}

/** Estudiante del grupo de origen con el destino propuesto por el backend. */
export interface EstudianteSugerido {
  id: number;
  nombre: string;
  codigo: string;
  destinoSugeridoId: number | null;
  destinoSugeridoLabel: string | null;
}

export interface SugerenciasPromocion {
  grupoOrigen: GrupoConEstudiantes;
  anioDestino: { id: number; anioLectivo: number };
  estudiantes: EstudianteSugerido[];
  /** Grupos del grado siguiente: destinos de "promover". */
  gruposDisponibles: GrupoResumen[];
  /** Grupos del mismo grado: destinos de "repetir". */
  gruposRepeticion: GrupoResumen[];
}

export interface GrupoCreado {
  id: number;
  label: string;
}

export interface GrupoOmitido {
  label: string;
  motivo: string;
}

export interface ResultadoClonado {
  anioLectivoId: number;
  anioLectivo: number;
  organizacionesCreadas: number;
  periodosCopiados: number;
  cortesCopiados: number;
  gruposCreados: GrupoCreado[];
  gruposOmitidos: GrupoOmitido[];
}

export interface DetallePromocion {
  estudianteId: number;
  nombre: string;
  grupoDestinoId: number | null;
  inscripcionesCreadas: number;
  omitido?: string;
}

export interface ResultadoPromocion {
  estudiantesPromovidos: number;
  estudiantesSinDestino: number;
  inscripcionesCreadas: number;
  detalle: DetallePromocion[];
}
