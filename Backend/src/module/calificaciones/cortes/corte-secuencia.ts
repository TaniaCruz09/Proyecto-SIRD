export type CorteFuente = {
  id: number;
  corte?: string | null;
  abreviatura?: string | null;
  orden?: number;
};

export type PeriodoFuente = {
  id: number;
  nombre: string;
  orden: number;
  cortes: CorteFuente[];
};

export function sortCortes<T extends { id?: number; orden?: number }>(
  cortes: T[],
): T[] {
  return [...cortes].sort((a, b) => {
    const ordenA = a.orden ?? Number.MAX_SAFE_INTEGER;
    const ordenB = b.orden ?? Number.MAX_SAFE_INTEGER;
    if (ordenA !== ordenB) return ordenA - ordenB;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

export function uniqueCortes(cortes: any[]): CorteFuente[] {
  const unicos = new Map<number, CorteFuente>();
  for (const corte of cortes ?? []) {
    if (corte?.id) unicos.set(corte.id, corte);
  }
  return [...unicos.values()];
}

/** Períodos del año lectivo con sus cortes ya ordenados. */
export function buildPeriodosFuente(anio: any): PeriodoFuente[] {
  const periodos = (anio?.periodosLectivos ?? []) as any[];

  return periodos
    .slice()
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map((periodo, index) => {
      const cortes = (periodo.cortesPeriodo ?? [])
        .slice()
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        .map((relacion) => ({
          ...(relacion.corte ?? {}),
          orden: relacion.orden ?? relacion.corte?.orden,
        }))
        .filter((corte) => Boolean(corte?.id)) as CorteFuente[];

      return {
        id: periodo.id ?? index + 1,
        nombre: periodo.nombre || periodo.abreviatura || `Periodo ${index + 1}`,
        orden: periodo.orden ?? index + 1,
        cortes: sortCortes(cortes),
      };
    })
    .filter((periodo) => periodo.cortes.length > 0);
}

/**
 * Orden de los cortes de una esquela: primero los períodos del año lectivo,
 * luego los cortes del año y por último los que ya tienen notas registradas.
 */
export function buildCortesFuente(
  anio: any,
  periodos: PeriodoFuente[],
  cortesDeFilas: any[] = [],
): CorteFuente[] {
  if (periodos.length > 0) {
    const unicos = new Map<number, CorteFuente>();
    for (const periodo of periodos) {
      for (const corte of periodo.cortes) {
        if (corte?.id && !unicos.has(corte.id)) unicos.set(corte.id, corte);
      }
    }
    if (unicos.size > 0) return [...unicos.values()];
  }

  const cortesAnio = (anio?.cortesAnioLectivo ?? [])
    .map((relacion) => relacion.corte)
    .filter((corte) => Boolean(corte?.id));

  if (cortesAnio.length > 0) {
    return sortCortes(cortesAnio);
  }

  return sortCortes(uniqueCortes(cortesDeFilas));
}

export function nombreCorte(corte?: CorteFuente | null): string {
  if (!corte) return 'corte anterior';
  const abreviatura = (corte.abreviatura ?? '').trim();
  const nombre = (corte.corte ?? '').trim();
  return abreviatura || nombre || `corte ${corte.id}`;
}

/** Las tablas de períodos son opcionales en instalaciones viejas. */
export function isMissingPeriodoTablesError(error: unknown): boolean {
  const message = (error as { message?: string })?.message ?? '';
  return (
    message.includes('catalogos.periodo_lectivo') ||
    message.includes('periodo_lectivo_corte')
  );
}
