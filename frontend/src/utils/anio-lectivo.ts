/** Un año lectivo inactivo es de solo consulta: se ve todo, no se edita. */
export const anioEstaActivo = (valor: unknown): boolean =>
  valor === true || valor === 'true' || valor === 1 || valor === '1';

/** Texto estándar del candado de edición. */
export const mensajeAnioInactivo = (anio?: number | string | null): string =>
  `El año lectivo ${anio ?? ''} está inactivo: solo se puede consultar.`.replace(
    '  ',
    ' ',
  );
