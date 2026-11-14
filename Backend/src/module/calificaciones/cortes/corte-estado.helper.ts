export type CorteEstado = 'open' | 'future' | 'closed' | 'unconfigured';

export type EvaluacionFecha = {
  estado: CorteEstado;
  editablePorFecha: boolean;
  mensajeFecha: string;
};

/**
 * Estado de un corte por fecha, con el mismo criterio que la validación de
 * guardado del backend: sin calendarización, sin fechas o fuera de rango no se
 * puede capturar.
 */
export function evaluarFechaCorte(
  fechaInicio: string | null | undefined,
  fechaFin: string | null | undefined,
  hoy: string,
  habilitado = true,
): EvaluacionFecha {
  if (!habilitado) {
    return {
      estado: 'unconfigured',
      editablePorFecha: false,
      mensajeFecha: 'Corte no habilitado en la calendarización',
    };
  }

  if (!fechaInicio || !fechaFin) {
    return {
      estado: 'unconfigured',
      editablePorFecha: false,
      mensajeFecha: 'Sin fechas asignadas en calendarización',
    };
  }

  if (hoy < fechaInicio) {
    return {
      estado: 'future',
      editablePorFecha: false,
      mensajeFecha: 'Aún no inicia',
    };
  }

  if (hoy > fechaFin) {
    return {
      estado: 'closed',
      editablePorFecha: false,
      mensajeFecha: 'Fecha cerrada',
    };
  }

  return { estado: 'open', editablePorFecha: true, mensajeFecha: 'En fecha' };
}

export function mensajeEstadoCorte({
  anioActivo,
  estado,
  mensajeFecha,
  secuenciaCompleta,
  completo,
}: {
  anioActivo: boolean;
  estado: CorteEstado;
  mensajeFecha: string;
  secuenciaCompleta: boolean;
  completo: boolean;
}): string {
  if (!anioActivo) return 'Solo consulta';
  if (!secuenciaCompleta) return 'Completa el corte anterior';
  if (estado === 'open') return completo ? 'Completado' : 'En progreso';
  return mensajeFecha;
}

export function formatearFechaCorte(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
}
