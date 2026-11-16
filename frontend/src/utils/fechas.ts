/** Máximo admitido en un <input type="date">: año de 4 dígitos (9999). */
export const FECHA_MAX_ANIO_CUATRO_DIGITOS = "9999-12-31"

/**
 * Recorta a 4 dígitos el año de una fecha ISO (YYYY-MM-DD).
 *
 * Algunos navegadores aceptan años de 5 o más dígitos ("20255-05-05"); como el
 * año debe tener 4, se conservan los primeros dígitos significativos:
 * "20255" -> "2025", "02025" -> "2025".
 */
export function limitarAnioFecha(value: string): string {
  const partes = /^(\d{5,})-(\d{2})-(\d{2})$/.exec(value)
  if (!partes) return value

  const [, anio, mes, dia] = partes
  const sinCeros = anio.replace(/^0+/, "") || "0"
  const anioCorto = sinCeros.slice(0, 4).padStart(4, "0")

  return `${anioCorto}-${mes}-${dia}`
}
