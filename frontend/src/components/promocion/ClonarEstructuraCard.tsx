"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarPlus,
  CheckCircle2,
  Loader2,
  TriangleAlert,
} from "lucide-react"

import { clonarEstructura } from "@/actions/promocionMethods/promocionMethods"
import {
  AnioLectivoResumen,
  ResultadoClonado,
} from "@/interfaces/promocionInterface"

interface ClonarEstructuraCardProps {
  anios: AnioLectivoResumen[]
  onClonado: () => void
}

const claseSelect =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-400"

export function ClonarEstructuraCard({
  anios,
  onClonado,
}: ClonarEstructuraCardProps) {
  const [anioOrigenId, setAnioOrigenId] = useState<number | null>(null)
  const [anioNuevo, setAnioNuevo] = useState<number>(
    new Date().getFullYear() + 1,
  )
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<ResultadoClonado | null>(null)
  const anioInicializado = useRef(false)

  const anioSugerido = useMemo(() => {
    const mayor = anios.reduce(
      (maximo, anio) => Math.max(maximo, anio.anioLectivo),
      0,
    )
    return mayor > 0 ? mayor + 1 : new Date().getFullYear() + 1
  }, [anios])

  useEffect(() => {
    if (anioOrigenId !== null || anios.length === 0) return
    const activo = anios.find((anio) => anio.isActive) ?? anios[0]
    setAnioOrigenId(activo.id)
  }, [anios, anioOrigenId])

  // Solo la primera vez: sugiere el año siguiente al más reciente.
  useEffect(() => {
    if (anioInicializado.current || anios.length === 0) return
    setAnioNuevo(anioSugerido)
    anioInicializado.current = true
  }, [anios, anioSugerido])

  const clonar = async () => {
    if (!anioOrigenId) return

    setGuardando(true)
    setError(null)
    setResultado(null)

    try {
      const respuesta = await clonarEstructura(anioOrigenId, anioNuevo)
      setResultado(respuesta)
      onClonado()
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el año")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <CalendarPlus className="h-5 w-5" />
          </span>
          Preparar el año lectivo
        </CardTitle>
        <p className="text-sm text-slate-500">
          Copia la organización, los grupos, las materias, la periodización y
          los cortes del año anterior. Los docentes se asignan después.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="anio-origen"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Año de origen
            </label>
            <select
              id="anio-origen"
              className={claseSelect}
              value={anioOrigenId ?? ""}
              onChange={(e) => setAnioOrigenId(Number(e.target.value))}
            >
              <option value="">Selecciona un año</option>
              {anios.map((anio) => (
                <option key={anio.id} value={anio.id}>
                  {anio.anioLectivo} · {anio.grupos} grupo(s)
                  {anio.isActive ? " · activo" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="anio-nuevo"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Año nuevo
            </label>
            <input
              id="anio-nuevo"
              type="number"
              min={2000}
              max={2100}
              className={claseSelect}
              value={anioNuevo}
              onChange={(e) => setAnioNuevo(Number(e.target.value))}
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={clonar}
          disabled={guardando || !anioOrigenId}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          {guardando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CalendarPlus className="h-4 w-4" />
          )}
          {guardando ? "Creando año…" : "Crear año y copiar estructura"}
        </Button>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {resultado && (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Año {resultado.anioLectivo} creado con{" "}
              {resultado.gruposCreados.length} grupo(s),{" "}
              {resultado.periodosCopiados} período(s) y{" "}
              {resultado.cortesCopiados} corte(s)
            </p>

            {resultado.gruposCreados.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resultado.gruposCreados.map((grupo) => (
                  <span
                    key={grupo.id}
                    className="rounded-full border border-green-200 bg-white px-2.5 py-0.5 text-xs font-medium text-green-700"
                  >
                    {grupo.label}
                  </span>
                ))}
              </div>
            )}

            {resultado.gruposOmitidos.length > 0 && (
              <div className="space-y-1">
                {resultado.gruposOmitidos.map((grupo) => (
                  <p
                    key={grupo.label}
                    className="flex items-start gap-2 text-xs text-amber-700"
                  >
                    <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      <strong>{grupo.label}</strong>: {grupo.motivo}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
