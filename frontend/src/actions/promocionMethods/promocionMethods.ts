import { feching } from "@/utils/cliente-http"
import {
  AnioLectivoResumen,
  DecisionPromocion,
  GrupoConEstudiantes,
  ResultadoClonado,
  ResultadoPromocion,
  SugerenciasPromocion,
} from "@/interfaces/promocionInterface"

/** Años lectivos con la cantidad de grupos de cada uno. */
export function getAniosLectivos(): Promise<AnioLectivoResumen[]> {
  return feching("/promocion/anios-lectivos", "no-cache", "GET")
}

/** Grupos de un año lectivo con su total de estudiantes. */
export function getGruposDelAnio(
  anioLectivoId: number,
): Promise<GrupoConEstudiantes[]> {
  return feching(
    `/promocion/grupos?anioLectivoId=${anioLectivoId}`,
    "no-cache",
    "GET",
  )
}

/** Estudiantes del grupo de origen con el destino ya sugerido. */
export function getSugerenciasPromocion(
  grupoOrigenId: number,
  anioDestinoId: number,
): Promise<SugerenciasPromocion> {
  return feching(
    `/promocion/sugerencias?grupoOrigenId=${grupoOrigenId}&anioDestinoId=${anioDestinoId}`,
    "no-cache",
    "GET",
  )
}

/** Crea el año lectivo nuevo copiando la estructura del anterior. */
export function clonarEstructura(
  anioOrigenId: number,
  anioDestino: number,
): Promise<ResultadoClonado> {
  return feching("/promocion/clonar-estructura", "no-cache", "POST", {
    anioOrigenId,
    anioDestino,
  })
}

/** Inscribe a los estudiantes en sus grupos destino. */
export function aplicarPromocion(
  grupoOrigenId: number,
  anioDestinoId: number,
  decisiones: DecisionPromocion[],
): Promise<ResultadoPromocion> {
  return feching("/promocion/aplicar", "no-cache", "POST", {
    grupoOrigenId,
    anioDestinoId,
    decisiones,
  })
}
