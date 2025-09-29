"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, GraduationCap, FileText, Search } from "lucide-react"
import { FaArrowUpRightFromSquare, FaBookOpen, FaUsers, FaPrint } from "react-icons/fa6"
import Link from "next/link"
import { motion } from 'framer-motion'
import { useAuth } from "@/hooks/useAuth"
import { getDocenteById } from "@/actions/docentesMethods/docentesMethods"
import { GrupoEscolar } from "@/interfaces"
import Header from "@/components/Header"

export default function HomePage() {
  const { docente } = useAuth();
  const [grupos, setGrupos] = useState<GrupoEscolar[]>([])
  const [searchYear, setSearchYear] = useState("")

  // Obtener las clases desde el backend
  useEffect(() => {
    if (!docente?.id) return;

    const fetchDocente = async () => {
      try {
        const res = await getDocenteById(docente.id)
        console.log(res)

        if (!res || !res.id) throw new Error("Error al obtener datos del docente")

        // Mapeamos grupos válidos (solo si tienen organizacionEscolar)
        const mappedClasses: GrupoEscolar[] = (res.grupos || [])
          .filter((g: any) => g.organizacionEscolar !== null)
          .map((g: any) => ({
            id: g.id,
            grado: g.grado,
            seccion: g.seccion,
            turno: g.turno,
            organizacionEscolar: g.organizacionEscolar,
            docenteGuia: g.docenteGuia,
            grupoAsignaturaDocente: g.grupoAsignaturaDocente,
          }))

        setGrupos(mappedClasses)
      } catch (error) {
        console.error("Error fetching docente:", error)
      }
    }

    fetchDocente()
  }, [docente?.id])

  // Filtrar activos e inactivos de forma segura
  const gruposActivos = grupos.filter(
    (c) => c.organizacionEscolar?.anio_lectivo?.isActive
  )
  const gruposInactivos = grupos.filter(
    (c) => !c.organizacionEscolar?.anio_lectivo?.isActive
  )

  // Filtrar histórico
  const filteredHistoricalClasses = gruposInactivos.filter(
    (g) =>
      searchYear === "" ||
      g.organizacionEscolar?.anio_lectivo?.anio_lectivo
        .toString()
        .includes(searchYear)
  )

  return (
    <div className="min-h-screen bg-purple-100/30">
      <Header title='Sistema de Calificaciones SIRD' subTitle='Home Docente' />
      <div className="container mx-auto px-6 py-7 flex gap-8">
        <main className="flex-1">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-foreground mb-1">{`Bienvenida Prof. ${docente?.nombres} ${docente?.apellido_paterno}`}</h2>
            <p className="text-muted-foreground">{`Docente de ${docente?.profession?.map((p: any) => p.profession).join(', ')} / podrá acceder a sus grados y registrar calificaciones`}</p>
          </div>

          {/* Accesos Directos */}
          <section className="mb-7">
            <div className="flex items-center bg-purple-100/30 rounded-xl pl-3 font-semibold text-black">
              <FaArrowUpRightFromSquare />
              <p className="pl-2">Accesos directos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center">
              {/* Card 1 */}
              <Link href={"/auth/users"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-67">
                  <Card className="bg-gradient-to-br from-blue-200 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                    <CardContent className="text-center">
                      <CardHeader className="flex flex-col items-center">
                        <FaBookOpen className="text-blue-900 text-2xl" />
                      </CardHeader>
                      <div className="text-lg font-bold text-slate-800">Calificaciones</div>
                      <p className="text-sm text-slate-600">Asignar las calificaciones</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
              {/* Card 2 */}
              <Link href={"/calificaciones"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-67">
                  <Card className="bg-gradient-to-br from-emerald-200 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                    <CardContent className="text-center">
                      <CardHeader className="flex flex-col items-center">
                        <FaUsers className="text-emerald-900 text-2xl" />
                      </CardHeader>
                      <div className="text-lg font-bold text-slate-800">Listado de Estudiantes</div>
                      <p className="text-sm text-slate-600">Ver listado de estudiantes</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
              {/* Card 3 */}
              <Link href={"/registerDocente"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-67">
                  <Card className="bg-gradient-to-br from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                    <CardContent className="text-center">
                      <CardHeader className="flex flex-col items-center">
                        <FaPrint className="text-yellow-700 text-2xl" />
                      </CardHeader>
                      <div className="text-lg font-bold text-slate-800">Reportes de Esquelas</div>
                      <p className="text-sm text-slate-600">Descarga reportes de esquelas</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
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
              <h3 className="text-lg text-left font-semibold text-foreground ml-4">
                Año en Proceso
              </h3>
              <div className={`grid gap-6 ${gruposActivos.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {gruposActivos.map((grupo) => (
                  <Card key={grupo.id} className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    <span className="absolute top-3 right-5">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Activo</Badge>
                    </span>

                    <CardHeader>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <GraduationCap className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            {grupo.grado.grades} - Sección {grupo.seccion.seccion} - {grupo.turno.turno}
                          </CardTitle>
                          <CardDescription className="text-gray-500">
                            {grupo.turno?.modalidad?.modalidad ?? "sin modalidad"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-100 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-gray-800">0</div>
                          <div className="text-gray-500 text-sm">Estudiantes</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-gray-800">0</div>
                          <div className="text-gray-500 text-sm">Promedio</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-gray-800">
                            {grupo.organizacionEscolar.anio_lectivo.anio_lectivo}
                          </div>
                          <div className="text-gray-500 text-sm">Año</div>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 rounded-lg py-2 flex justify-center items-center gap-2">
                        <FileText className="w-4 h-4" /> Ver Esquela
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar Historial */}
        <aside className="w-85 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Historial de Grados</h3>
          <p className="text-sm text-gray-500">Grados guía anteriores</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por año..."
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredHistoricalClasses.length > 0 ? (
              filteredHistoricalClasses.map((classData) => (
                <Card key={classData.id} className="hover:shadow-lg transition-all rounded-xl cursor-pointer">
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <BookOpen className="w-4 h-4 text-blue-500" /> {classData.grado.grades} - {classData.seccion.seccion} - {classData.turno.turno}
                      </div>
                      <Badge variant="outline" className="text-xs">{classData.organizacionEscolar.anio_lectivo.anio_lectivo}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {classData.turno.modalidad?.modalidad}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Estudiantes: falta</span>
                      <span>Promedio: falta</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <FileText className="w-3 h-3 mr-1" /> Ver Esquela
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">{searchYear ? "No se encontraron resultados" : "No hay historial disponible"}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
