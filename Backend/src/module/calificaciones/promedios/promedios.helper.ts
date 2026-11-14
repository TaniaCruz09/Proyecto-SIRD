import { CorteFuente, PeriodoFuente } from '../cortes/corte-secuencia';

export function promedio(valores: number[]): number {
  const validos = valores.filter((valor) => Number.isFinite(valor));
  if (validos.length === 0) return 0;
  return Math.round(
    validos.reduce((total, valor) => total + valor, 0) / validos.length,
  );
}

export type PromediosAsignatura = {
  porCorte: Map<number, number>;
  porPeriodo: Map<number, number>;
  final: number;
};

/**
 * Promedios de una asignatura para un estudiante:
 * - período = promedio de los cortes del período (corte sin nota cuenta como 0)
 * - final = promedio de los períodos
 */
export function calcularPromedios(
  cortes: CorteFuente[],
  periodos: PeriodoFuente[],
  valorPorCorte: (corteId: number) => number,
): PromediosAsignatura {
  const porCorte = new Map<number, number>();
  for (const corte of cortes) {
    const valor = valorPorCorte(corte.id);
    porCorte.set(corte.id, Number.isFinite(valor) ? valor : 0);
  }

  const porPeriodo = new Map<number, number>();
  for (const periodo of periodos) {
    porPeriodo.set(
      periodo.id,
      promedio(periodo.cortes.map((corte) => porCorte.get(corte.id) ?? 0)),
    );
  }

  const final = promedio([...porPeriodo.values()]);

  return { porCorte, porPeriodo, final };
}

/** Períodos a usar cuando el año lectivo no los tiene configurados. */
export function periodosDeTrabajo(
  periodos: PeriodoFuente[],
  cortes: CorteFuente[],
): PeriodoFuente[] {
  if (periodos.length > 0) return periodos;
  if (cortes.length === 0) return [];
  return [{ id: 1, nombre: 'Período único', orden: 1, cortes }];
}
