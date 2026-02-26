'use client'

import { FaUsers, FaUserShield, FaBook, FaGraduationCap } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { AcademicYearsDashboard } from '@/components/organizacionEscolar/tablero-de-años-academicos'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import ConfirmModal from '@/app/recuperarContrasena/modal/modalCambioRol'

export default function HomePage() {
  const router = useRouter()
  const { rol, login, roles } = useAuth()
  const rolesArray = roles ? (Array.isArray(roles) ? roles : [roles]) : []
  const tieneMultiplesRoles = rolesArray.length > 1
  const [cambiandoRol, setCambiandoRol] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nuevoRol, setNuevoRol] = useState<'Admin' | 'Docente'>(() => {
    // valor por defecto seguro si rol no está listo aún
    return rol === 'Docente' ? 'Admin' : 'Docente'
  })
  useEffect(() => {
    // cuando cambien roles o rol actualiza nuevoRol por si el hook se inicializa después del login
    if (!rol) return
    const current = String(rol).toLowerCase()
    const other = rolesArray.find(r => String(r).toLowerCase() !== current)
    if (other) setNuevoRol(String(other).toLowerCase() === 'admin' ? 'Admin' : 'Docente')
    else setNuevoRol(current === 'admin' ? 'Docente' : 'Admin')
  }, [roles, rol])

  console.log('Roles disponibles para el usuario (normalizado):', rolesArray)

  const handleAbrirModal = () => {
    if (!rol) return
    const current = String(rol).toLowerCase()
    const other = rolesArray.find(r => String(r).toLowerCase() !== current)
    setNuevoRol(other ? (String(other).toLowerCase() === 'admin' ? 'Admin' : 'Docente') : (rol === 'Admin' ? 'Docente' : 'Admin'))
    setIsModalOpen(true)
  }

  const handleConfirmarCambio = async () => {
    setCambiandoRol(true)
    await login(nuevoRol)
    setIsModalOpen(false)
    router.push(nuevoRol === 'Admin' ? '/admin/home' : '/docente/home')
  }
  // 🔹 Mostrar loading mientras se carga el docente
  if (cambiandoRol) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del docente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-100/30">
      <Header title="Sistema de Calificaciones SIRD" subTitle="Panel de Administración" />
      <main className="max-w-7xl mx-auto px-6">
        <div className="m-5">
          <h2 className="text-2xl font-bold text-foreground mb-1">Bienvenido {rol}</h2>
          <p className="text-muted-foreground">
            Administra fácilmente las funciones del sistema desde aquí
          </p>
        </div>

        <div className="flex items-center justify-between bg-purple-100/30 rounded-xl p-4 font-semibold text-black">
          {/* Botón para cambiar rol solo si tiene más de un rol */}
          {tieneMultiplesRoles && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAbrirModal}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {rol === 'Admin' ? 'Cambiar a Docente' : 'Cambiar a Admin'}
              </Button>

              <ConfirmModal
                isOpen={isModalOpen}
                title="Cambiar Rol"
                message={`¿Estás seguro que quieres cambiar tu rol a ${nuevoRol}?`}
                onConfirm={handleConfirmarCambio}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          )}

          {/* Accesos directos */}
          <div className="flex items-center gap-2 text-gray-700">
            <FaArrowUpRightFromSquare className="text-lg" />
            <p>Accesos directos</p>
          </div>
        </div>

        {/* Tarjetas de acceso directo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 place-items-center mb-5">

          {/* Card 1: Usuarios y Roles */}
          <Link href="/auth/users">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-blue-200 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardContent className="text-center">
                  <CardHeader className="flex flex-col items-center">
                    <FaUserShield className="text-blue-900 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Gestiona Usuarios</div>
                  <p className="text-sm text-slate-600">Agregar, editar o eliminar</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Card 2: Registro Calificaciones */}
          <Link href="/calificaciones">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-emerald-200 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardContent className="text-center">
                  <CardHeader className="flex flex-col items-center">
                    <FaBook className="text-emerald-900 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Calificaciones</div>
                  <p className="text-sm text-slate-600">Revisa calificaciones de los grados</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Card 3: Registro Docente */}
          <Link href="/docente/registerDocente">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-purple-200 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardContent className="text-center">
                  <CardHeader className="flex flex-col items-center">
                    <FaUsers className="text-purple-800 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Gestion Docentes</div>
                  <p className="text-sm text-slate-600">Agregar, editar o eliminar</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Registro Estudiantes */}
          <Link href="/registerEstudent">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-70">
              <Card className="bg-gradient-to-br from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer">
                <CardContent className="text-center">
                  <CardHeader className="flex flex-col items-center">
                    <FaGraduationCap className="text-yellow-700 text-2xl" />
                  </CardHeader>
                  <div className="text-lg font-bold text-slate-800">Gestion Estudiantes</div>
                  <p className="text-sm text-slate-600">Agregar, editar o eliminar</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>

        {/* Dashboard Años Académicos */}
        <div className="bg-card rounded-lg border border-border p-6">
          <AcademicYearsDashboard />
        </div>
      </main>
    </div>
  )
}
