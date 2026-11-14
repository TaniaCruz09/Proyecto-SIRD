import { GrupoResumen } from './interfaces/promocion.interfaces';

/**
 * Elige el grupo que se propone por defecto para un estudiante: el del grado
 * siguiente con la misma sección (Séptimo A -> Octavo A). Si no existe esa
 * sección, usa el primer grupo disponible; si no hay ninguno, no sugiere nada.
 */
export const elegirGrupoSugerido = (
  gruposDisponibles: GrupoResumen[],
  seccionId: number | null,
): GrupoResumen | null =>
  gruposDisponibles.find((grupo) => grupo.seccionId === seccionId) ??
  gruposDisponibles[0] ??
  null;

/** Etiqueta legible de un grupo: "Octavo A · matutino · Modalidad regular". */
export const etiquetaGrupo = (
  grado?: string | null,
  seccion?: string | null,
  turno?: string | null,
  modalidad?: string | null,
): string =>
  [
    [grado?.trim(), seccion?.trim()].filter(Boolean).join(' '),
    turno?.trim(),
    modalidad?.trim(),
  ]
    .filter(Boolean)
    .join(' · ');
