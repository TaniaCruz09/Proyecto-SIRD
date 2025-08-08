'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import NavbarAdmin from '@/components/navbarAdmin'
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
    <div className="flex h-screen">
      <NavbarAdmin />
      <div className="p-6 w-full bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Filtrar para Registrar Notas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {/* Año lectivo */}
          <div>
            <label className="block mb-1 font-semibold">Año Escolar</label>
            <select
              value={anioSeleccionado}
              onChange={(e) => setAnioSeleccionado(e.target.value)}
              className="w-full border px-4 py-2 rounded-md text-black"
            >
              <option value="">Selecciona año</option>
              {anios.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Grupo */}
          <div>
            <label className="block mb-1 font-semibold">Grupo</label>
            <select
              value={grupoSeleccionado ?? ""}
              onChange={(e) => setGrupoSeleccionado(Number(e.target.value))}
              className="w-full border px-4 py-2 rounded-md text-black"
              disabled={!anioSeleccionado}
            >
              <option value="">Selecciona grupo</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Asignatura */}
          <div>
            <label className="block mb-1 font-semibold">Asignatura</label>
            <select
              value={asignaturaSeleccionada}
              onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
              className="w-full border px-4 py-2 rounded-md text-black"
              disabled={!grupoSeleccionado}
            >
              <option value="">Selecciona asignatura</option>
              {asignaturas.map((a) => (
                <option key={a.id} value={a.id}>{a.asignatura}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleRedirigir}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
          >
            Aplicar Filtro
          </button>
        </div>
      </div>
    </div>
  )
}
