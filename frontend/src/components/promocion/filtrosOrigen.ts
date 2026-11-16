import type { GrupoConAnio, GrupoResumen } from "@/interfaces/promocionInterface"

/** Filtros opcionales para acotar los grupos de origen en la promoción. */
export interface FiltrosGrupoOrigen {
  anioId: number | null
  gradoId: number | null
  organizacion: string | null
}

export interface OpcionAnio {
  id: number
  anio: number
}

export interface OpcionGrado {
  id: number
  grado: string
  orden: number
}

/** Etiqueta de la organización escolar (turno + modalidad) del grupo. */
export function organizacionGrupo(grupo: GrupoResumen): string {
  return (
    [grupo.turno, grupo.modalidad].filter(Boolean).join(" · ") ||
    "Sin organización"
  )
}

/** Grupos que cumplen todos los filtros activos. */
export function filtrarGruposOrigen(
  grupos: GrupoConAnio[],
  { anioId, gradoId, organizacion }: FiltrosGrupoOrigen,
): GrupoConAnio[] {
  return grupos.filter(
    (grupo) =>
      (anioId === null || grupo.anioId === anioId) &&
      (gradoId === null || grupo.gradoId === gradoId) &&
      (organizacion === null || organizacionGrupo(grupo) === organizacion),
  )
}

/** Años lectivos que aún tienen grupos con los demás filtros aplicados. */
export function opcionesAnio(
  grupos: GrupoConAnio[],
  { gradoId, organizacion }: FiltrosGrupoOrigen,
): OpcionAnio[] {
  const aniosPorId = new Map<number, number>()

  for (const grupo of grupos) {
    if (gradoId !== null && grupo.gradoId !== gradoId) continue
    if (organizacion !== null && organizacionGrupo(grupo) !== organizacion) continue
    aniosPorId.set(grupo.anioId, grupo.anio)
  }

  return [...aniosPorId.entries()]
    .map(([id, anio]) => ({ id, anio }))
    .sort((a, b) => b.anio - a.anio)
}

/** Grados disponibles según el año y la organización elegidos. */
export function opcionesGrado(
  grupos: GrupoConAnio[],
  { anioId, organizacion }: FiltrosGrupoOrigen,
): OpcionGrado[] {
  const grados = new Map<number, OpcionGrado>()

  for (const grupo of grupos) {
    if (anioId !== null && grupo.anioId !== anioId) continue
    if (organizacion !== null && organizacionGrupo(grupo) !== organizacion) continue
    if (grupo.gradoId === null) continue

    grados.set(grupo.gradoId, {
      id: grupo.gradoId,
      grado: grupo.grado ?? "",
      orden: grupo.ordenGrado ?? 0,
    })
  }

  return [...grados.values()].sort((a, b) => a.orden - b.orden)
}

/** Organizaciones escolares disponibles según el año y el grado elegidos. */
export function opcionesOrganizacion(
  grupos: GrupoConAnio[],
  { anioId, gradoId }: FiltrosGrupoOrigen,
): string[] {
  const organizaciones = new Set<string>()

  for (const grupo of grupos) {
    if (anioId !== null && grupo.anioId !== anioId) continue
    if (gradoId !== null && grupo.gradoId !== gradoId) continue
    organizaciones.add(organizacionGrupo(grupo))
  }

  return [...organizaciones].sort((a, b) => a.localeCompare(b))
}
