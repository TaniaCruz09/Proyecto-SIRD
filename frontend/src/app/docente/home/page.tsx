"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, History, ArrowRight, Users, BookCheck } from "lucide-react"
import { FaArrowUpRightFromSquare, FaBookOpen, FaClockRotateLeft } from "react-icons/fa6"
import Link from "next/link"
import { motion } from 'framer-motion'
import { useAuth } from "@/hooks/useAuth"
import { getDocenteById } from "@/actions/docentesMethods/docentesMethods"
import { GrupoEscolar } from "@/interfaces"
import Header from "@/components/Header"
import GenerarEsquelaButton from "@/components/calificaciones/GenerarEsquelaButton"


export default function HomePage() {
  const [grupos, setGrupos] = useState<GrupoEscolar[]>([])
  const { rol, docente } = useAuth()


  // Obtener las clases desde el backend
  useEffect(() => {
    if (!docente?.id) return;
    const fetchDocente = async (docenteId: number) => {
      try {
        const res = await getDocenteById(docenteId)
        console.log("Datos del docente obtenidos:", res)

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

            const estudiantesInactivos = new Set(
              relacionesEstudiantes
                .filter((relacion: any) => relacion?.activo === false)
                .map((relacion: any) => relacion?.estudiante?.id)
                .filter((id: any) => Number.isFinite(Number(id)))
            )

            return {
              id: g.id,
              grado: g.grado,
              seccion: g.seccion,
              turno: g.turno,
              numero_estudiantes: estudiantesUnicos.size,
              numero_estudiantes_inactivos: estudiantesInactivos.size,
              numero_materias: materiasUnicas.size,
              organizacionEscolar: g.organizacionEscolar,
              docenteGuia: g.docenteGuia,
              grupoAsignaturaDocente: g.grupoAsignaturaDocente,
              esquelaHead: g.esquelaHead,
            }
          })

        setGrupos(mappedClasses)
        // si el contexto no tiene docente, setearlo (opcional)
        // setDocente(res) // si tienes setter expuesto en useAuth podrías actualizar aquí
      } catch (error) {
        console.error("Error fetching docente:", error)
      }
    }

    // Si cambiamos a rol Docente, intentar cargar docente desde localStorage (userId) y API
    if (rol !== 'Docente') return
    // Si ya tenemos docente en contexto, usar su id
    if (docente?.id) {
      fetchDocente(docente.id)
      return
    }
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      fetchDocente(Number(storedUserId))
    }
  }, [docente?.id, rol])

  // Filtrar solo grupos activos
  const gruposActivos = grupos.filter(
    (c) => c.organizacionEscolar?.anio_lectivo?.isActive
  )


  return (
    <div className="min-h-screen bg-purple-100/30">
      <Header title='Sistema de Calificaciones SIRD' subTitle='Home Docente' />
      <div className="container mx-auto px-6 py-7">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-foreground mb-1">{`Bienvenida Prof. ${docente?.nombres} ${docente?.apellido_paterno}`}</h2>
            <p className="text-muted-foreground">{`Docente de ${docente?.profession?.map((p: any) => p.profession).join(', ')} / podrá acceder a sus grados y registrar calificaciones`}</p>
          </div>

          {/* Accesos Directos */}
          <section className="mb-10">
            <div className="flex items-center gap-3 text-gray-700 mb-6">
              <FaArrowUpRightFromSquare className="text-xl text-black-600" />
              <p className="text-base font-semibold">Accesos directos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1 - Calificaciones */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-md">
                        <FaBookOpen className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Calificaciones</h3>
                        <p className="text-sm text-gray-500">Asignar calificaciones a los estudiantes</p>
                      </div>
                    </div>
                    <Link href={"/docente/gruposAsignados"}>
                      <Button className="h-11 px-5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all">
                        Ir a Calificaciones
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>

              {/* Card 2 - Historial de Grados */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-400 rounded-xl flex items-center justify-center shadow-md">
                        <FaClockRotateLeft className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Historial de Grados</h3>
                        <p className="text-sm text-gray-500">Ver grados guía de años anteriores</p>
                      </div>
                    </div>
                    <Link href={"/docente/historialGrados"}>
                      <Button className="h-11 px-5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all">
                        Ver Historial
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Si no hay grupos activos */}
          {gruposActivos.length === 0 ? (
            <Card className="text-center py-10 mt-6">
              <CardContent>
                <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  Aún no tienes asignado ningún grado en un año activo.
                </p>
              </CardContent>
            </Card>
          ) : (
            <section className="mb-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Grado Guía - Semestre Actual</h3>
              </div>
              <div className={`grid gap-6 ${gruposActivos.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {gruposActivos.map((grupo) => (
                  <Card key={grupo.id} className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                    {/* Barra superior */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />

                    <CardContent className="p-6">
                      {/* Header con badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                            <GraduationCap className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-800">
                              {grupo.grado.grades} - Sección {grupo.seccion.seccion} - {grupo.turno.turno}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500 mt-0.5">
                              {grupo.turno?.modalidad?.modalidad ?? "Sin modalidad"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-3 py-1.5 font-medium shadow-sm">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5" />
                          Activo
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-3 mb-5">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                          <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                          <div className="text-xl font-bold text-blue-700">{grupo.numero_estudiantes ?? 0}</div>
                          <div className="text-xs text-blue-500 font-medium">Estudiantes</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center">
                          <BookCheck className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                          <div className="text-xl font-bold text-purple-700">{grupo.numero_materias ?? 0}</div>
                          <div className="text-xs text-purple-500 font-medium">Materias</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center border border-red-200">
                          <Users className="w-4 h-4 text-red-500 mx-auto mb-1" />
                          <div className="text-xl font-bold text-red-700">{grupo.numero_estudiantes_inactivos ?? 0}</div>
                          <div className="text-xs text-red-500 font-medium">Inactivos</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center">
                          <GraduationCap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                          <div className="text-lg font-bold text-amber-700">
                            {grupo.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? "—"}
                          </div>
                          <div className="text-xs text-amber-500 font-medium">Año</div>
                        </div>
                      </div>

                      {/* Botón */}
                      <div className="w-full">
                        <GenerarEsquelaButton grupoId={grupo.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
      </div>
    </div>
  )
}
