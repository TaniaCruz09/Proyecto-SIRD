'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import NavbarAdmin from '@/components/navbarAdmin'

type GrupoEstudiante = {
  id: number
  organizacion: {
    id: number
    añoLectivo: { anio: number }
    grupo: {
      id: number
      grado: { nombre: string }
      seccion: { nombre: string }
      modalidad: { nombre: string }
      turno: { nombre: string }
    }
  }
}

export default function FiltroNotasPage() {
  const router = useRouter()

  const [data, setData] = useState<GrupoEstudiante[]>([])

  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null)
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<string>("")
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string>("")
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null)

  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<string>("");

  const asignaturas = useMemo(() => {
    // Aquí iría la lógica para obtener asignaturas según grupo, grado o modalidad.
    // Por ejemplo, un array fijo o desde tu API.
    return ["Matemáticas", "Ciencias", "Historia"];
  }, []);

  // Simular fetch de tu API — reemplaza por fetch real
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/asignar-estudiantes`)
      const json = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  const anios = useMemo(() => {
    if (!Array.isArray(data)) return []; // Verificamos que data sea un arreglo
    return [...new Set(data.map((d) => d.organizacion.añoLectivo.anio))];
  }, [data]);

  const modalidades = useMemo(() => {
    if (!Array.isArray(data)) return []; // Validación
    return [
      ...new Set(
        data
          .filter((d) => d.organizacion.añoLectivo.anio === anioSeleccionado)
          .map((d) => d.organizacion.grupo.modalidad.nombre)
      ),
    ];
  }, [anioSeleccionado, data]);

  const turnos = useMemo(() => {
    if (!Array.isArray(data)) return []; // Validación
    return [...new Set(data
      .filter((d) =>
        d.organizacion.añoLectivo.anio === anioSeleccionado &&
        d.organizacion.grupo.modalidad.nombre === modalidadSeleccionada
      )
      .map((d) => d.organizacion.grupo.turno.nombre))]
  }, [anioSeleccionado, modalidadSeleccionada, data])

  const gruposFiltrados = useMemo(() => {
    if (!Array.isArray(data)) return []; // Validación
    return data.filter((d) =>
      d.organizacion.añoLectivo.anio === anioSeleccionado &&
      d.organizacion.grupo.modalidad.nombre === modalidadSeleccionada &&
      d.organizacion.grupo.turno.nombre === turnoSeleccionado
    )
  }, [anioSeleccionado, modalidadSeleccionada, turnoSeleccionado, data])

  const handleRedirigir = () => {
    if (grupoSeleccionado && anioSeleccionado) {
      router.push(`/calificaciones/registro?idGrupo=${grupoSeleccionado}&anio=${anioSeleccionado}`)
    } else {
      alert('Completa todos los filtros')
    }
  }

  return (
    <div className="flex h-screen">
      <NavbarAdmin />
      <div className="p-6 w-full bg-gray-100">
        <h1 className="text-2xl text-black font-bold mb-6 text-blue-800">Filtrar Grupo para Registrar Notas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div>
            <label className="block mb-1 font-semibold text-black">Año Escolar</label>
            <select
              value={anioSeleccionado ?? ""}
              onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
              className="w-full border px-4 py-2 rounded-md text-black"
            >
              <option value="" disabled>Selecciona año</option>
              {anios.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-black">Grupo Escolar</label>
            <select
              value={modalidadSeleccionada}
              onChange={(e) => setModalidadSeleccionada(e.target.value)}
              className="w-full border px-4 py-2 rounded-md text-black"
              disabled={!anioSeleccionado}
            >
              <option value="" disabled>Selecciona un grupo Escolar</option>
              {modalidades.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black">Asignatura</label>
            <select
              value={modalidadSeleccionada}
              onChange={(e) => setModalidadSeleccionada(e.target.value)}
              className="w-full border px-4 py-2 rounded-md text-black"
              disabled={!anioSeleccionado}
            >
              <option value="" disabled>Selecciona una asignatura</option>
              {modalidades.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>

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
