"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { BookOpen, Clock, GraduationCap, FileText, Search, Home, BarChart3 } from "lucide-react"
import CerrarSecion from '@/components/cerrarSesion'
import { FaArrowUpRightFromSquare } from "react-icons/fa6"
import Link from "next/link"
import { motion } from 'framer-motion'
import { FaBook, FaUsers, FaUserShield } from "react-icons/fa"

interface GradeClass {
  id: string
  year: number
  grade: string
  section: string
  modalidad: string
  students: number
  status: "active" | "completed"
  averageGrade: number
  period: string
}

const mockData: GradeClass[] = [
  {
    id: "1",
    year: 2024,
    grade: "10°",
    section: "A",
    modalidad: "Secundaria para Jovenes y Adultos",
    students: 32,
    status: "active",
    averageGrade: 8.5,
    period: "Segundo Semestre",
  },
  {
    id: "2",
    year: 2023,
    grade: "9°",
    section: "B",
    modalidad: "Secundaria para Jovenes y Adultos",
    students: 28,
    status: "completed",
    averageGrade: 8.2,
    period: "Año Completo",
  },
  {
    id: "3",
    year: 2022,
    grade: "8°",
    section: "A",
    modalidad: "Secundaria Regular Diurno",
    students: 30,
    status: "completed",
    averageGrade: 7.8,
    period: "Año Completo",
  },
  {
    id: "4",
    year: 2021,
    grade: "7°",
    section: "C",
    modalidad: "Secundaria Regular Diurno",
    students: 25,
    status: "completed",
    averageGrade: 8.0,
    period: "Año Completo",
  },
]

export default function HomePage() {
  const [selectedClass, setSelectedClass] = useState<GradeClass | null>(null)
  const [searchYear, setSearchYear] = useState("")

  const currentClass = mockData.find((c) => c.status === "active")
  const historicalClasses = mockData.filter((c) => c.status === "completed")

  const filteredHistoricalClasses = historicalClasses.filter(
    (classData) => searchYear === "" || classData.year.toString().includes(searchYear),
  )

  const handleViewGrades = (classData: GradeClass) => {
    setSelectedClass(classData)
    console.log("Navegando a calificaciones de:", classData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Bienvenida Prof. María Pérez</h1>
                <p className="text-muted-foreground">Docente de Matemáticas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CerrarSecion />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <main className="flex-1">
            {/* Accesos Directos */}
            <section className="mb-8">
              <div className="flex items-center bg-gradient-to-b from-gray-50 to-purple-50 rounded-xl pl-3 font-semibold text-black">
                <FaArrowUpRightFromSquare />
                <p className="pl-2">Accesos directos</p>
              </div>

              {/* Tarjetas de acceso directo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Usuarios y Roles */}
                <Link href={"/auth/users"}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
                    <Card className="bg-gradient-to-br from-blue-200 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                      <CardContent className="text-center">
                        <div className="flex flex-col items-center">
                          <FaUserShield className="text-black text-2xl" />
                        </div>
                        <div className="text-lg font-bold text-slate-800">Usuarios y Roles</div>
                        <p className="text-sm text-slate-600">
                          Gestiona los usuarios del sistema y sus permisos
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>

                {/* Card 2: Registro Calificaciones*/}
                <Link href={"/calificaciones"}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
                    <Card className="bg-gradient-to-br from-emerald-200 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                      <CardContent className="text-center">
                        <div className="flex flex-col items-center">
                          <FaBook className="text-black text-2xl" />
                        </div>
                        <div className="text-lg font-bold text-slate-800">Calificaciones</div>
                        <p className="text-sm text-slate-600">
                          Administra las calificaciones de los grados y más
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>

                {/* Card 3: Registro Docente */}
                <Link href={"/registerDocente"}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
                    <Card className="bg-gradient-to-br from-purple-200 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                      <CardContent className="text-center">
                        <div className="flex flex-col items-center">
                          <FaUsers className="text-black text-2xl" />
                        </div>
                        <div className="text-lg font-bold text-slate-800">Registro de Docentes</div>
                        <p className="text-sm text-slate-600">
                          Agrega o edita los docentes del sistema
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </div>
            </section>

            {currentClass && (
              <section className="mb-8">
                <div className="mb-2">
                  <h3 className="text-xl text-left font-semibold text-foreground">Año en Proceso</h3>
                </div>

                <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <GraduationCap className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">{currentClass.grade} - Sección {currentClass.section}</CardTitle>
                        <CardDescription className="text-gray-500">{currentClass.modalidad}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-gray-800">{currentClass.students}</div>
                        <div className="text-gray-500 text-sm">Estudiantes</div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-gray-800">{currentClass.averageGrade}</div>
                        <div className="text-gray-500 text-sm">Promedio</div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-gray-800">{currentClass.year}</div>
                        <div className="text-gray-500 text-sm">Año</div>
                      </div>
                    </div>
                    <Button onClick={() => handleViewGrades(currentClass)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 rounded-lg py-2 flex justify-center items-center gap-2">
                      <FileText className="w-4 h-4" /> Ver Esquela
                    </Button>
                  </CardContent>
                </Card>
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
                          <BookOpen className="w-4 h-4 text-blue-500" /> {classData.grade} - {classData.section}
                        </div>
                        <Badge variant="outline" className="text-xs">{classData.year}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{classData.modalidad}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Estudiantes: {classData.students}</span>
                        <span>Promedio: {classData.averageGrade}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleViewGrades(classData)}>
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
    </div>
  )
}