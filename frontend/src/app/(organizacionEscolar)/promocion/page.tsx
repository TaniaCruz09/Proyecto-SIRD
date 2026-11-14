"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarCog, Loader2 } from "lucide-react"

import {
  getAniosLectivos,
  getGruposDelAnio,
} from "@/actions/promocionMethods/promocionMethods"
import { ClonarEstructuraCard } from "@/components/promocion/ClonarEstructuraCard"
import { PromocionEstudiantesCard } from "@/components/promocion/PromocionEstudiantesCard"
import {
  AnioLectivoResumen,
  GrupoConEstudiantes,
} from "@/interfaces/promocionInterface"

type GrupoConAnio = GrupoConEstudiantes & { anio: number }

export default function PromocionPage() {
  const [anios, setAnios] = useState<AnioLectivoResumen[]>([])
  const [grupos, setGrupos] = useState<GrupoConAnio[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarDatos = useCallback(async () => {
    setError(null)

    try {
      const aniosLectivos = await getAniosLectivos()

      const gruposPorAnio = await Promise.all(
        aniosLectivos.map(async (anio) => {
          const gruposDelAnio = await getGruposDelAnio(anio.id)
          return gruposDelAnio.map((grupo) => ({
            ...grupo,
            anio: anio.anioLectivo,
          }))
        }),
      )

      setAnios(aniosLectivos)
      setGrupos(gruposPorAnio.flat())
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cargar la información",
      )
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargarDatos()
  }, [cargarDatos])

  return (
    <div className="container mx-auto max-w-5xl p-6 text-left">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
          <CalendarCog className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Promoción de estudiantes
          </h1>
          <p className="text-sm text-slate-500">
            Prepara el año nuevo y pasa a los estudiantes al grado siguiente.
          </p>
        </div>
      </header>

      {cargando ? (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando años lectivos…
        </p>
      ) : (
        <div className="space-y-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <ClonarEstructuraCard anios={anios} onClonado={cargarDatos} />

          <PromocionEstudiantesCard
            anios={anios}
            grupos={grupos}
            onAplicado={cargarDatos}
          />
        </div>
      )}
    </div>
  )
}
