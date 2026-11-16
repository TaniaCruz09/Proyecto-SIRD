"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, PencilLine, Users } from "lucide-react"

import {
  aplicarPromocion,
  getSugerenciasPromocion,
} from "@/actions/promocionMethods/promocionMethods"
import {
  AnioLectivoResumen,
  DecisionPromocion,
  GrupoConAnio,
  ResultadoPromocion,
  SugerenciasPromocion,
} from "@/interfaces/promocionInterface"
import {
  FiltrosGrupoOrigen,
  filtrarGruposOrigen,
  opcionesAnio,
  opcionesGrado,
  opcionesOrganizacion,
} from "@/components/promocion/filtrosOrigen"

interface PromocionEstudiantesCardProps {
  anios: AnioLectivoResumen[]
  grupos: GrupoConAnio[]
  onAplicado: () => void
}

const claseSelect =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-400"

/** '' significa "no continúa": el estudiante no se inscribe en el año destino. */
type Decisiones = Record<number, string>

export function PromocionEstudiantesCard({
  anios,
  grupos,
  onAplicado,
}: PromocionEstudiantesCardProps) {
  const [grupoOrigenId, setGrupoOrigenId] = useState<number | null>(null)
  const [anioDestinoId, setAnioDestinoId] = useState<number | null>(null)
  const [filtroAnioId, setFiltroAnioId] = useState<number | null>(null)
  const [filtroGradoId, setFiltroGradoId] = useState<number | null>(null)
  const [filtroOrganizacion, setFiltroOrganizacion] = useState<string | null>(
    null,
  )
  const [sugerencias, setSugerencias] = useState<SugerenciasPromocion | null>(
    null,
  )
  const [decisiones, setDecisiones] = useState<Decisiones>({})
  const [cargando, setCargando] = useState(false)
  const [aplicando, setAplicando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<ResultadoPromocion | null>(null)

  const gruposConEstudiantes = useMemo(
    () => grupos.filter((grupo) => grupo.estudiantes > 0),
    [grupos],
  )

  // Cada filtro se alimenta de los grupos que cumplen los demás filtros activos,
  // así las opciones se reducen a medida que se elige año, grado u organización.
  const filtros = useMemo<FiltrosGrupoOrigen>(
    () => ({
      anioId: filtroAnioId,
      gradoId: filtroGradoId,
      organizacion: filtroOrganizacion,
    }),
    [filtroAnioId, filtroGradoId, filtroOrganizacion],
  )

  const aniosFiltro = useMemo(
    () => opcionesAnio(gruposConEstudiantes, filtros),
    [gruposConEstudiantes, filtros],
  )

  const gradosFiltro = useMemo(
    () => opcionesGrado(gruposConEstudiantes, filtros),
    [gruposConEstudiantes, filtros],
  )

  const organizacionesFiltro = useMemo(
    () => opcionesOrganizacion(gruposConEstudiantes, filtros),
    [gruposConEstudiantes, filtros],
  )

  const gruposFiltrados = useMemo(
    () => filtrarGruposOrigen(gruposConEstudiantes, filtros),
    [gruposConEstudiantes, filtros],
  )

  const hayFiltros = Boolean(
    filtroAnioId !== null || filtroGradoId !== null || filtroOrganizacion,
  )

  const cambiarAnio = (valor: string) => {
    setFiltroAnioId(valor ? Number(valor) : null)
    setFiltroGradoId(null)
    setFiltroOrganizacion(null)
  }

  const cambiarGrado = (valor: string) => {
    setFiltroGradoId(valor ? Number(valor) : null)
    setFiltroOrganizacion(null)
  }

  const limpiarFiltros = () => {
    setFiltroAnioId(null)
    setFiltroGradoId(null)
    setFiltroOrganizacion(null)
  }

  // Si la opción elegida deja de existir con los datos actuales (por ejemplo al
  // terminar de promover ese grado), se limpia junto con los filtros que dependen
  // de ella para no dejar una selección que ya no tiene grupos.
  useEffect(() => {
    if (
      filtroAnioId !== null &&
      !aniosFiltro.some((anio) => anio.id === filtroAnioId)
    ) {
      setFiltroAnioId(null)
      setFiltroGradoId(null)
      setFiltroOrganizacion(null)
      return
    }

    if (
      filtroGradoId !== null &&
      !gradosFiltro.some((grado) => grado.id === filtroGradoId)
    ) {
      setFiltroGradoId(null)
      setFiltroOrganizacion(null)
      return
    }

    if (
      filtroOrganizacion !== null &&
      !organizacionesFiltro.includes(filtroOrganizacion)
    ) {
      setFiltroOrganizacion(null)
    }
  }, [
    aniosFiltro,
    gradosFiltro,
    organizacionesFiltro,
    filtroAnioId,
    filtroGradoId,
    filtroOrganizacion,
  ])

  const destinos = useMemo(
    () =>
      sugerencias
        ? [...sugerencias.gruposDisponibles, ...sugerencias.gruposRepeticion]
        : [],
    [sugerencias],
  )

  const etiquetaDestino = useCallback(
    (valor: string) =>
      valor === ""
        ? "Sin destino"
        : (destinos.find((grupo) => String(grupo.id) === valor)?.label ??
          `Grupo ${valor}`),
    [destinos],
  )

  const cargarSugerencias = useCallback(async () => {
    if (!grupoOrigenId || !anioDestinoId) return

    setCargando(true)
    setError(null)
    setResultado(null)

    try {
      const respuesta = await getSugerenciasPromocion(
        grupoOrigenId,
        anioDestinoId,
      )
      setSugerencias(respuesta)
      setDecisiones(
        Object.fromEntries(
          respuesta.estudiantes.map((estudiante) => [
            estudiante.id,
            estudiante.destinoSugeridoId
              ? String(estudiante.destinoSugeridoId)
              : "",
          ]),
        ),
      )
    } catch (e) {
      setSugerencias(null)
      setDecisiones({})
      setError(e instanceof Error ? e.message : "No se pudieron calcular los destinos")
    } finally {
      setCargando(false)
    }
  }, [grupoOrigenId, anioDestinoId])

  useEffect(() => {
    if (!grupoOrigenId || !anioDestinoId) {
      setSugerencias(null)
      setDecisiones({})
      return
    }
    void cargarSugerencias()
  }, [grupoOrigenId, anioDestinoId, cargarSugerencias])

  // Si el grupo elegido deja de estar disponible (por un filtro o tras promoverlo),
  // se limpia la selección para no mostrar un grupo que ya no está en la lista.
  useEffect(() => {
    if (grupoOrigenId === null) return
    if (gruposFiltrados.some((grupo) => grupo.id === grupoOrigenId)) return
    setGrupoOrigenId(null)
  }, [grupoOrigenId, gruposFiltrados])

  const resumen = useMemo(() => {
    if (!sugerencias) return []

    const conteo = new Map<string, number>()
    for (const estudiante of sugerencias.estudiantes) {
      const etiqueta = etiquetaDestino(decisiones[estudiante.id] ?? "")
      conteo.set(etiqueta, (conteo.get(etiqueta) ?? 0) + 1)
    }

    return [...conteo.entries()]
  }, [sugerencias, decisiones, etiquetaDestino])

  const excepciones = useMemo(() => {
    if (!sugerencias) return 0

    return sugerencias.estudiantes.filter(
      (estudiante) =>
        (decisiones[estudiante.id] ?? "") !==
        String(estudiante.destinoSugeridoId ?? ""),
    ).length
  }, [sugerencias, decisiones])

  const cambiarTodos = (valor: string) => {
    if (!sugerencias) return
    setDecisiones(
      Object.fromEntries(
        sugerencias.estudiantes.map((estudiante) => [estudiante.id, valor]),
      ),
    )
  }

  const aplicar = async () => {
    if (!sugerencias || !grupoOrigenId || !anioDestinoId) return

    const payload: DecisionPromocion[] = sugerencias.estudiantes.map(
      (estudiante) => {
        const valor = decisiones[estudiante.id] ?? ""
        return {
          estudianteId: estudiante.id,
          destinoGrupoId: valor === "" ? null : Number(valor),
        }
      },
    )

    setAplicando(true)
    setError(null)

    try {
      const respuesta = await aplicarPromocion(
        grupoOrigenId,
        anioDestinoId,
        payload,
      )
      setResultado(respuesta)
      onAplicado()
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo aplicar la promoción")
    } finally {
      setAplicando(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <Users className="h-5 w-5" />
          </span>
          Promover estudiantes
        </CardTitle>
        <p className="text-sm text-slate-500">
          El destino viene sugerido por la sección del grupo. Solo cambia las
          excepciones: los que repiten, los que pasan a otra sección o los que
          no continúan.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Filtrar grupos de origen
              </p>
              <p className="text-xs text-slate-500">
                Usa los filtros que necesites: las opciones se ajustan a lo que
                ya elegiste.
              </p>
            </div>
            <button
              type="button"
              onClick={limpiarFiltros}
              disabled={!hayFiltros}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="filtro-anio"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Año lectivo
              </label>
              <select
                id="filtro-anio"
                className={claseSelect}
                value={filtroAnioId ?? ""}
                onChange={(e) => cambiarAnio(e.target.value)}
              >
                <option value="">Todos los años</option>
                {aniosFiltro.map((anio) => (
                  <option key={anio.id} value={anio.id}>
                    {anio.anio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filtro-grado"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Grado
              </label>
              <select
                id="filtro-grado"
                className={claseSelect}
                value={filtroGradoId ?? ""}
                onChange={(e) => cambiarGrado(e.target.value)}
              >
                <option value="">Todos los grados</option>
                {gradosFiltro.map((grado) => (
                  <option key={grado.id} value={grado.id}>
                    {grado.grado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filtro-organizacion"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Organización escolar
              </label>
              <select
                id="filtro-organizacion"
                className={claseSelect}
                value={filtroOrganizacion ?? ""}
                onChange={(e) => setFiltroOrganizacion(e.target.value || null)}
              >
                <option value="">Todas las organizaciones</option>
                {organizacionesFiltro.map((organizacion) => (
                  <option key={organizacion} value={organizacion}>
                    {organizacion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="grupo-origen"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Grupo de origen
            </label>
            <select
              id="grupo-origen"
              className={claseSelect}
              value={grupoOrigenId ?? ""}
              onChange={(e) =>
                setGrupoOrigenId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">
                {gruposFiltrados.length > 0
                  ? "Selecciona un grupo"
                  : "Sin grupos con estos filtros"}
              </option>
              {gruposFiltrados.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {filtroAnioId === null
                    ? `${grupo.label} · ${grupo.anio}`
                    : grupo.label}{" "}
                  ({grupo.estudiantes} estudiantes)
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              {gruposFiltrados.length} grupo(s) con estudiantes pendientes
              {hayFiltros ? " con los filtros aplicados" : ""}.
            </p>
          </div>

          <div>
            <label
              htmlFor="anio-destino"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Año destino
            </label>
            <select
              id="anio-destino"
              className={claseSelect}
              value={anioDestinoId ?? ""}
              onChange={(e) =>
                setAnioDestinoId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Selecciona un año</option>
              {anios.map((anio) => (
                <option key={anio.id} value={anio.id}>
                  {anio.anioLectivo} · {anio.grupos} grupo(s)
                </option>
              ))}
            </select>
          </div>
        </div>

        {cargando && (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Calculando destinos…
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {sugerencias && !cargando && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2">
              <span className="text-sm text-slate-600">
                Aplicar a todos:
              </span>
              <select
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                value=""
                onChange={(e) => {
                  if (!e.target.value) return
                  cambiarTodos(e.target.value === "__sin__" ? "" : e.target.value)
                }}
              >
                <option value="">Elegir destino…</option>
                <option value="__sin__">Sin destino</option>
                {destinos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Estudiante
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Código
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Destino
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sugerencias.estudiantes.map((estudiante) => {
                    const valor = decisiones[estudiante.id] ?? ""
                    const esExcepcion =
                      valor !== String(estudiante.destinoSugeridoId ?? "")

                    return (
                      <tr
                        key={estudiante.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-green-50/40"
                      >
                        <td className="px-3 py-3 font-medium text-slate-800">
                          <span className="flex items-center gap-2">
                            {estudiante.nombre}
                            {esExcepcion && (
                              <PencilLine className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-500">
                          {estudiante.codigo}
                        </td>
                        <td className="px-3 py-3">
                          <select
                            className="w-full max-w-[240px] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                            value={valor}
                            onChange={(e) =>
                              setDecisiones((previo) => ({
                                ...previo,
                                [estudiante.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Sin destino (no continúa)</option>
                            {sugerencias.gruposDisponibles.length > 0 && (
                              <optgroup label="Promover">
                                {sugerencias.gruposDisponibles.map((grupo) => (
                                  <option key={grupo.id} value={grupo.id}>
                                    {grupo.label}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {sugerencias.gruposRepeticion.length > 0 && (
                              <optgroup label="Repetir grado">
                                {sugerencias.gruposRepeticion.map((grupo) => (
                                  <option key={grupo.id} value={grupo.id}>
                                    {grupo.label}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
              <span>
                {sugerencias.estudiantes.length} estudiante(s) ·{" "}
                <span className={excepciones > 0 ? "font-medium text-amber-700" : ""}>
                  {excepciones} excepción(es)
                </span>
              </span>
              <span className="flex flex-wrap gap-2">
                {resumen.map(([etiqueta, total]) => (
                  <span
                    key={etiqueta}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {etiqueta}: {total}
                  </span>
                ))}
              </span>
            </div>

            <Button
              type="button"
              onClick={aplicar}
              disabled={aplicando || sugerencias.estudiantes.length === 0}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {aplicando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              {aplicando ? "Promoviendo…" : "Promover estudiantes"}
            </Button>
          </>
        )}

        {resultado && (
          <div className="space-y-1 rounded-xl border border-green-200 bg-green-50/70 p-4 text-sm text-green-800">
            <p className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {resultado.estudiantesPromovidos} estudiante(s) promovido(s)
            </p>
            {resultado.estudiantesSinDestino > 0 && (
              <p className="text-green-700">
                {resultado.estudiantesSinDestino} estudiante(s) sin destino (no
                continúan).
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
