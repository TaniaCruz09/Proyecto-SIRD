'use client'
import { FaUsers, FaUserShield, FaBook, FaGraduationCap } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { AcademicYearsDashboard } from '@/components/organizacionEscolar/tablero-de-años-academicos'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import EstadisticaAdmin from '@/components/EstadisticaAdmin'
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-purple-100/30">
      <Header title='Sistema de Calificaciones SIRD' subTitle='Panel de Administración' />
      <main className="max-w-7xl mx-auto px-6">
        <div className="m-5">
          <h2 className="text-2xl font-bold text-foreground mb-1">Bienvenido Administrador</h2>
          <p className=" text-muted-foreground">Administra fácilmente las funciones del sistema desde aquí</p>
        </div>

        <div className="flex items-center bg-purple-100/30 rounded-xl pl-3 font-semibold text-black">
          <FaArrowUpRightFromSquare />
          <p className="pl-2">Accesos directos</p>
        </div>

        {/* Tarjetas de acceso directo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 place-items-center mb-5">

          {/* Card 1: Usuarios y Roles */}
          <Link href={"/auth/users"}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-blue-200 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardContent className="text-center">
                  <CardHeader className="flex flex-col items-center">
                    <FaUserShield className="text-blue-900 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Gestiona Usuarios</div>
                  <p className="text-sm text-slate-600">
                    Agregar, editar o eliminar
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
                  <CardHeader className="flex flex-col items-center">
                    <FaBook className="text-emerald-900 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Calificaciones</div>
                  <p className="text-sm text-slate-600">
                    Revisa calificaciones de los grados
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
                  <CardHeader className="flex flex-col items-center">
                    <FaUsers className="text-purple-800 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Gestion Docentes</div>
                  <p className="text-sm text-slate-600">
                    Agregar, editar o eliminar
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Registro Estudiantes */}
          <Link href={"/registerEstudent"}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardContent className="text-center">
                  <CardHeader className="flex flex-col items-center">
                    <FaGraduationCap className="text-yellow-700 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Gestion Estudiantes</div>
                  <p className="text-sm text-slate-600">
                    Agregar, editar o eliminar
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>
        {/* <EstadisticaAdmin /> */}
        <div className="bg-card rounded-lg border border-border p-6 ">
          <AcademicYearsDashboard />
        </div>
      </main>
    </div>
  )
}