"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, FileText, Search, ArrowLeft, Users, GraduationCap } from "lucide-react"
import { FaClockRotateLeft } from "react-icons/fa6"
import { useAuth } from "@/hooks/useAuth"
import { getDocenteById } from "@/actions/docentesMethods/docentesMethods"
import { GrupoEscolar } from "@/interfaces"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion'

export default function HistorialGradosPage() {
  const [grupos, setGrupos] = useState<GrupoEscolar[]>([])
  const [searchYear, setSearchYear] = useState("")
  const router = useRouter()
  const { rol, docente } = useAuth()

  useEffect(() => {
    if (!docente?.id) return;
    const fetchDocente = async (docenteId: number) => {
      try {
        const res = await getDocenteById(docenteId)
        if (!res || !res.id) throw new Error("Error al obtener datos del docente")

        const mappedClasses: GrupoEscolar[] = (res.grupos || [])
          .filter((g: any) => g.organizacionEscolar !== null)
          .map((g: any) => {
            const relacionesEstudiantes = (g.grupoAsignaturaDocente || [])
              .flatMap((rel: any) => rel?.gruposConEstudiantes || [])

            const materiasUnicas = new Set(
              (g.grupoAsignaturaDocente || [])
                .map((rel: any) => rel?.asignatura?.id)
                .filter((id: any) => Number.isFinite(Number(id)))
            )

            const estudiantesUnicos = new Set(
              relacionesEstudiantes
                .map((relacion: any) => relacion?.estudiante?.id)
                .filter((id: any) => Number.isFinite(Number(id)))
            )

            return {
              id: g.id,
              grado: g.grado,
              seccion: g.seccion,
              turno: g.turno,
              numero_estudiantes: estudiantesUnicos.size,
              numero_estudiantes_inactivos: 0,
              numero_materias: materiasUnicas.size,
              organizacionEscolar: g.organizacionEscolar,
              docenteGuia: g.docenteGuia,
              grupoAsignaturaDocente: g.grupoAsignaturaDocente,
              esquelaHead: g.esquelaHead,
            }
          })

        setGrupos(mappedClasses)
      } catch (error) {
        console.error("Error fetching docente:", error)
      }
    }

    if (rol !== 'Docente') return
    if (docente?.id) {
      fetchDocente(docente.id)
      return
    }
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      fetchDocente(Number(storedUserId))
    }
  }, [docente?.id, rol])

  const gruposInactivos = grupos.filter(
    (c) => !c.organizacionEscolar?.anio_lectivo?.isActive
  )

  const filteredHistoricalClasses = gruposInactivos.filter(
    (g) =>
      searchYear === "" ||
      g.organizacionEscolar?.anio_lectivo?.anio_lectivo
        .toString()
        .includes(searchYear)
  )

  return (
    <div className="min-h-screen bg-purple-100/30">
      <Header title='Sistema de Calificaciones SIRD' subTitle='Historial de Grados' />
      <div className="container mx-auto px-6 py-7">
        {/* Botón de regreso */}
        <button
          onClick={() => router.push('/docente/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
        >
          <div className="p-1.5 rounded-lg bg-white shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Volver al inicio</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-md">
              <FaClockRotateLeft className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Historial de Grados</h2>
              <p className="text-muted-foreground text-sm">Grados guía anteriores</p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por año..."
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>

        {/* Grid de historial */}
        {filteredHistoricalClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistoricalClasses.map((classData, index) => (
              <motion.div
                key={classData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                  {/* Barra superior */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-500" />
                  <CardContent className="p-6">
                    {/* Header con badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-base">
                            {classData.grado.grades} - Sección {classData.seccion.seccion} - {classData.turno.turno}
                          </h3>
                          <p className="text-sm text-gray-500">{classData.turno.modalidad?.modalidad ?? "Sin modalidad"}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1.5 font-medium shadow-sm">
                        {classData.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? "Sin año"}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Estudiantes: <strong>{classData.numero_estudiantes ?? "—"}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span>Materias: <strong>{classData.numero_materias ?? "—"}</strong></span>
                      </div>
                    </div>

                    {/* Botón */}
                    <Button
                      size="default"
                      className="w-full h-11 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => router.push(`/esquela-calificaciones/${classData.esquelaHead?.id}`)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Esquela
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 max-w-lg mx-auto rounded-2xl">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-500">
                {searchYear ? "No se encontraron resultados" : "No hay historial disponible"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchYear ? "Intenta con otro año de búsqueda" : "Aún no tienes grados guía anteriores"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
