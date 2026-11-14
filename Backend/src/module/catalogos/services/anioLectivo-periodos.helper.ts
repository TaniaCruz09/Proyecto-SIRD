import { BadRequestException } from '@nestjs/common';

export type TipoPeriodizacionConfig = {
  tipo: string;
  totalPeriodos: number;
  etiquetaPeriodo: string;
  prefijoAbreviatura: string;
  tipoPeriodizacionId?: number;
};

export type CortePlan = { id: number; orden: number };

export type PeriodoPlan = {
  orden: number;
  nombre: string;
  abreviatura: string;
  cortes: CortePlan[];
};

export type PlanPeriodos = {
  totalPeriodos: number;
  totalCortes: number;
  periodos: PeriodoPlan[];
};

function nombrePeriodo(
  etiqueta: string,
  prefijo: string,
  orden: number,
): { nombre: string; abreviatura: string } {
  const etiquetaLimpia = (etiqueta || 'Periodo').trim();
  const prefijoLimpio = (prefijo || 'P').trim();
  return {
    nombre: `${etiquetaLimpia} ${orden}`,
    abreviatura: `${prefijoLimpio}${orden}`,
  };
}

/** Cortes válidos, sin duplicados y en el orden recibido. */
export function normalizarCorteIds(
  cortes: Array<{ id?: number | string } | number | string> | null | undefined,
): number[] {
  const ids = (cortes ?? [])
    .map((corte) =>
      Number(
        typeof corte === 'object' && corte !== null
          ? (corte as { id?: number | string }).id
          : corte,
      ),
    )
    .filter((id) => Number.isFinite(id) && id > 0);

  return Array.from(new Set(ids));
}

/**
 * Distribuye los cortes entre los períodos del tipo de periodización.
 * Lanza `BadRequestException` si la combinación no es válida.
 */
export function construirPlanDesdeCortes(
  config: TipoPeriodizacionConfig,
  cortes: Array<{ id?: number | string } | number | string> | null | undefined,
): PlanPeriodos {
  const corteIds = normalizarCorteIds(cortes);
  const totalCortes = corteIds.length;
  const totalPeriodos = Number(config?.totalPeriodos ?? 0);

  if (totalCortes === 0) {
    throw new BadRequestException(
      'Debes seleccionar al menos un corte para el anio lectivo',
    );
  }

  if (!Number.isFinite(totalPeriodos) || totalPeriodos <= 0) {
    throw new BadRequestException(
      'La cantidad de periodos debe ser mayor que cero',
    );
  }

  if (totalCortes < totalPeriodos) {
    throw new BadRequestException(
      `Debes seleccionar al menos ${totalPeriodos} cortes para ${totalPeriodos} periodos; solo enviaste ${totalCortes}`,
    );
  }

  const base = Math.floor(totalCortes / totalPeriodos);
  const resto = totalCortes % totalPeriodos;

  let indice = 0;
  const periodos: PeriodoPlan[] = Array.from(
    { length: totalPeriodos },
    (_, posicion) => {
      const orden = posicion + 1;
      const cantidad = base + (posicion < resto ? 1 : 0);
      const cortesPeriodo = corteIds
        .slice(indice, indice + cantidad)
        .map((id, posicionCorte) => ({ id, orden: posicionCorte + 1 }));
      indice += cantidad;

      const { nombre, abreviatura } = nombrePeriodo(
        config.etiquetaPeriodo,
        config.prefijoAbreviatura,
        orden,
      );

      return { orden, nombre, abreviatura, cortes: cortesPeriodo };
    },
  );

  return { totalPeriodos, totalCortes, periodos };
}

export type PeriodoEntrada = {
  orden?: number | string;
  nombre?: string;
  abreviatura?: string;
  cortes?: Array<{ id?: number | string; orden?: number | string }> | null;
};

/**
 * Valida y normaliza una distribución enviada explícitamente por el cliente
 * (payload `periodos`). No permite períodos vacíos ni cortes repetidos.
 */
export function validarPlanExplicito(
  config: TipoPeriodizacionConfig,
  periodos: PeriodoEntrada[] | null | undefined,
  cortesEsperados?: Array<{ id?: number | string } | number | string> | null,
): PlanPeriodos {
  const lista = (periodos ?? []).filter(Boolean);

  if (lista.length === 0) {
    throw new BadRequestException(
      'Debes indicar al menos un periodo para el anio lectivo',
    );
  }

  const totalPeriodos = Number(config?.totalPeriodos ?? 0);
  if (Number.isFinite(totalPeriodos) && totalPeriodos > 0 && lista.length !== totalPeriodos) {
    throw new BadRequestException(
      `El tipo de periodizacion requiere ${totalPeriodos} periodos y enviaste ${lista.length}`,
    );
  }

  const vistos = new Map<number, number>();
  const periodosNormalizados: PeriodoPlan[] = lista.map((periodo, posicion) => {
    const orden = Number.isFinite(Number(periodo?.orden))
      ? Number(periodo.orden)
      : posicion + 1;

    const corteIds = normalizarCorteIds(periodo?.cortes);

    if (corteIds.length === 0) {
      throw new BadRequestException(
        `El periodo ${orden} no tiene cortes asignados`,
      );
    }

    for (const corteId of corteIds) {
      const periodoPrevio = vistos.get(corteId);
      if (periodoPrevio != null) {
        throw new BadRequestException(
          `El corte ${corteId} esta repetido en los periodos ${periodoPrevio} y ${orden}`,
        );
      }
      vistos.set(corteId, orden);
    }

    const { nombre, abreviatura } = nombrePeriodo(
      config.etiquetaPeriodo,
      config.prefijoAbreviatura,
      orden,
    );

    return {
      orden,
      nombre: periodo?.nombre?.trim() || nombre,
      abreviatura: periodo?.abreviatura?.trim() || abreviatura,
      cortes: corteIds.map((id, posicionCorte) => ({
        id,
        orden: posicionCorte + 1,
      })),
    };
  });

  const ordenes = periodosNormalizados.map((periodo) => periodo.orden);
  if (new Set(ordenes).size !== ordenes.length) {
    throw new BadRequestException(
      'Los periodos tienen un orden repetido; usa 1, 2, 3...',
    );
  }

  const idsEnPeriodos = Array.from(vistos.keys());
  const esperados = normalizarCorteIds(cortesEsperados);
  if (esperados.length > 0) {
    const faltantes = esperados.filter((id) => !vistos.has(id));
    if (faltantes.length > 0) {
      throw new BadRequestException(
        `Los cortes ${faltantes.join(', ')} no estan asignados a ningun periodo`,
      );
    }

    const sobrantes = idsEnPeriodos.filter((id) => !esperados.includes(id));
    if (sobrantes.length > 0) {
      throw new BadRequestException(
        `Los cortes ${sobrantes.join(', ')} no pertenecen a la lista de cortes del anio lectivo`,
      );
    }
  }

  periodosNormalizados.sort((a, b) => a.orden - b.orden);

  return {
    totalPeriodos: periodosNormalizados.length,
    totalCortes: idsEnPeriodos.length,
    periodos: periodosNormalizados,
  };
}
