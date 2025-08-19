'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { getOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods'
import { OrganizacionEscolar } from '@/interfaces'

export default function FiltroNotasPage() {
  const [organizacionesEscolar, setOrganizacionesEscolar] = useState<OrganizacionEscolar[]>([])
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>("")
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null)
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrganizacionEscolar()
      setOrganizacionesEscolar(data)
    }
    fetchData()
  }, [])

  const anios = useMemo(() => {
    return [...new Set(organizacionesEscolar.map((o) => o.anio_lectivo.anio_lectivo))]
  }, [organizacionesEscolar])

  const grupos = useMemo(() => {
    return organizacionesEscolar
      .filter((o) => o.anio_lectivo.anio_lectivo.toString() === anioSeleccionado)
      .map((o) => ({
        id: o.id,
        label: `${o.grupo.grado.grades} - ${o.grupo.seccion.seccion} - ${o.grupo.turno.turno} - ${o.grupo.modalidad.modalidad}`
      }))
  }, [organizacionesEscolar, anioSeleccionado])

  const asignaturas = useMemo(() => {
    const org = organizacionesEscolar.find((o) => o.id === grupoSeleccionado)
    return org?.asignaturas || []
  }, [grupoSeleccionado, organizacionesEscolar])

  const handleRedirigir = () => {
    if (grupoSeleccionado && asignaturaSeleccionada) {
      router.push(
        `/calificaciones/registro?idGrupo=${grupoSeleccionado}&anio=${anioSeleccionado}&asignatura=${asignaturaSeleccionada}`
      )
    } else {
      alert('Completa todos los filtros')
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-white rounded-xl mx-6">
      <h1 className="text-3xl font-bold mb-15 text-center text-gray-800">
        Filtrar para Registrar Notas
      </h1>

      <div className="grid grid-cols-6 gap-6 max-w-5xl mx-auto p-6 rounded-xl shadow-lg bg-gray-50">
        {/* Año lectivo */}
        <div className="col-span-1">
          <label className="block mb-2 font-semibold text-gray-700">Año Escolar</label>
          <select
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          >
            <option value="">Selecciona año</option>
            {anios.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Grupo */}
        <div className="col-span-3">
          <label className="block mb-2 font-semibold text-gray-700">Grupo</label>
          <select
            value={grupoSeleccionado ?? ""}
            onChange={(e) => setGrupoSeleccionado(Number(e.target.value))}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all whitespace-normal break-words"
            disabled={!anioSeleccionado}
          >
            <option value="">Selecciona grupo</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id} title={g.label}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Asignatura */}
        <div className="col-span-2">
          <label className="block mb-2 font-semibold text-gray-700">Asignatura</label>
          <select
            value={asignaturaSeleccionada}
            onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            disabled={!grupoSeleccionado}
          >
            <option value="">Selecciona asignatura</option>
            {asignaturas.map((a) => (
              <option key={a.id} value={a.id}>{a.asignatura}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleRedirigir}
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Aplicar Filtro
        </button>
      </div>
      <p className="text-center text-gray-700 mt-25 max-w-md mx-auto">
        Selecciona correctamente el año, grupo y asignatura para registrar las notas.
      </p>
    </div>
  )
}