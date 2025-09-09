'use client'
import { FaUsers, FaUserShield, FaBook, FaGraduationCap } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import CerrarSecion from '@/components/cerrarSesion'
import { AcademicYearsDashboard } from '@/components/organizacionEscolar/tablero-de-años-academicos'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import EstadisticaAdmin from '@/components/EstadisticaAdmin'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between">
            {/* Título y subtítulo */}
            <div>
              <h1 className="text-2xl font-bold text-black mb-0.5">
                Sistema de Calificaciones SIRD
              </h1>
              <p className="text-gray-600 text-sm">
                Panel de Administración
              </p>
            </div>

            {/* Botón o componente de cierre de sesión */}
            <CerrarSecion />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6">
        <div className="m-5">
          <h2 className="text-2xl font-bold text-foreground mb-3">Bienvenido Administrador</h2>
          <p className="text-lg text-muted-foreground">Administra fácilmente las funciones del sistema desde aquí</p>
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl pl-3 font-semibold text-black">
          <FaArrowUpRightFromSquare />
          <p className="pl-2">Accesos directos</p>
        </div>

        {/* Tarjetas de acceso directo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 place-items-center bg-white border rounded-xl p-5 mb-5">

          {/* Card 1: Usuarios y Roles */}
          <Link href={"/auth/users"}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-blue-200 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardHeader className="flex flex-col items-center">
                  <FaUserShield className="text-black text-3xl" />
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-xl font-bold text-slate-800">Usuarios y Roles</div>
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
                <CardHeader className="flex flex-col items-center">
                  <FaBook className="text-black text-3xl" />
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-xl font-bold text-slate-800">Calificaciones</div>
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
                <CardHeader className="flex flex-col items-center">
                  <FaUsers className="text-black text-3xl" />
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-xl font-bold text-slate-800">Registro de Docentes</div>
                  <p className="text-sm text-slate-600">
                    Agrega o edita los docentes del sistema
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Registro Estudiantes */}
          <Link href={"/registerEstudent"}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardHeader className="flex flex-col items-center">
                  <FaGraduationCap className="text-black text-3xl" />
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-xl font-bold text-slate-800">Estudiantes</div>
                  <p className="text-sm text-slate-600">
                    Gestiona los estudiantes registrados
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>
        <EstadisticaAdmin />
        <div className="bg-card rounded-lg border border-border p-6 ">
          <AcademicYearsDashboard />
        </div>
      </main>
    </div>
  )
}