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
    <div className="min-h-screen bg-slate-50">
      <Header title='Sistema de Calificaciones SIRD' subTitle='Panel Docente' />
      <div className="container mx-auto px-4 py-6 sm:px-6">
          <div className="mb-5">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">{`Bienvenid@ Prof. ${docente?.nombres} ${docente?.apellido_paterno}`}</h2>
            <p className="text-slate-500">{`Docente de ${docente?.profession?.map((p: any) => p.profession).join(', ')} / podrá acceder a sus grados y registrar calificaciones`}</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1 - Calificaciones */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="flex h-full flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                      <FaBookOpen className="text-base" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-tight text-slate-900">Calificaciones</h3>
                      <p className="text-sm text-slate-500">Asignar calificaciones a los estudiantes</p>
                    </div>
                  </div>
                  <Link href={"/docente/gruposAsignados"} className="mt-4 block">
                    <Button className="h-10 w-full rounded-lg bg-emerald-600 font-medium text-white hover:bg-emerald-700">
                      Ir a Calificaciones
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              {/* Card 2 - Historial de Grados */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="flex h-full flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                      <FaClockRotateLeft className="text-base" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-tight text-slate-900">Historial de Grados</h3>
                      <p className="text-sm text-slate-500">Ver grados guía de años anteriores</p>
                    </div>
                  </div>
                  <Link href={"/docente/historialGrados"} className="mt-4 block">
                    <Button
                      variant="outline"
                      className="h-10 w-full rounded-lg border-blue-200 font-medium text-blue-700 hover:bg-blue-50"
                    >
                      Ver Historial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </div>
        

          {/* Si no hay grupos activos */}
          {gruposActivos.length === 0 ? (
            <Card className="mt-6 py-10 text-center border-slate-200">
              <CardContent>
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="font-medium text-slate-600">
                  Aún no tienes asignado ningún grado en un año activo.
                </p>
              </CardContent>
            </Card>
          ) : (
            <section className="mb-5 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-blue-50 p-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Grado Guía - Semestre Actual</h3>
              </div>
              <div className={`grid gap-6 ${gruposActivos.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {gruposActivos.map((grupo) => (
                  <Card key={grupo.id} className="rounded-2xl border border-slate-200 border-t-4 border-t-emerald-300 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

                    <CardContent className="p-6">
                      {/* Header con badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-2.5">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-slate-900">
                              {grupo.grado?.grades ?? "Sin grado"} - Sección {grupo.seccion.seccion} - {grupo.organizacionEscolar?.turno?.turno}
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-sm text-slate-500">
                              {grupo.organizacionEscolar?.turno?.modalidad?.modalidad ?? "Sin modalidad"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="shrink-0 border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5" />
                          Activo
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                          <Users className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                          <div className="text-lg font-semibold text-blue-700">{grupo.numero_estudiantes ?? 0}</div>
                          <div className="text-xs font-medium text-blue-600">Estudiantes</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                          <BookCheck className="mx-auto mb-1 h-4 w-4 text-violet-500" />
                          <div className="text-lg font-semibold text-violet-700">{grupo.numero_materias ?? 0}</div>
                          <div className="text-xs font-medium text-violet-600">Materias</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                          <Users className="mx-auto mb-1 h-4 w-4 text-rose-500" />
                          <div className="text-lg font-semibold text-rose-700">{grupo.numero_estudiantes_inactivos ?? 0}</div>
                          <div className="text-xs font-medium text-rose-600">Inactivos</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                          <GraduationCap className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                          <div className="text-lg font-semibold text-amber-700">
                            {grupo.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? "—"}
                          </div>
                          <div className="text-xs font-medium text-amber-600">Año</div>
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
