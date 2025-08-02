'use client'

import { FaUsers, FaUserShield, FaBook, FaChalkboardTeacher, FaGraduationCap, FaCogs } from 'react-icons/fa'
import { motion } from 'framer-motion'
import NavbarAdmin from '@/components/navbarAdmin'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import CerrarSecion from '@/components/cerrarSesion'

export default function HomePage() {
  return (
    <div className="flex h-screen bg-white">
      <div>
        <NavbarAdmin />
      </div>
      <div className="w-screen p-6 text-center bg-gray-100 overflow-auto">
        <div className="flex items-center justify-between">

          <h2 className="text-2xl md:text-2xl font-bold text-blue-900 drop-shadow-md mb-6">
            Página de inicio
          </h2>
          <CerrarSecion />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 drop-shadow-md mb-6">
          Bienvenido Administrador al Sistema de Calificaciones SIRD
        </h2>
        <p className="text-lg text-blue-800 mb-12">
          Administra fácilmente las funciones del sistema desde aquí
        </p>

        <div className="flex items-center bg-white rounded-t-xl pl-3 font-semibold text-black">
          <FaArrowUpRightFromSquare />
          <p className="pl-2">Accesos directos</p>
        </div>

        {/* Tarjetas de acceso directo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center bg-white border rounded-b-xl p-8">
          {/* Usuarios y Roles */}
          <Card
            icon={<FaUserShield className="text-black text-4xl mb-4" />}
            title="Usuarios y Roles"
            description="Gestiona los usuarios del sistema y sus permisos"
            bgColor="bg-green-500/40 hover:bg-green-400/60"
          />

          {/* Catálogos */}
          <Card
            icon={<FaBook className="text-black text-4xl mb-4" />}
            title="Catálogos"
            description="Administra asignaturas, grados, turnos y más"
            bgColor="bg-yellow-400/40 hover:bg-yellow-300/60"
          />

          {/* Organización Escolar */}
          <Card
            icon={<FaChalkboardTeacher className="text-black text-4xl mb-4" />}
            title="Organización Escolar"
            description="Define grupos y estructura educativa"
            bgColor="bg-blue-400/30 hover:bg-blue-300/50"
          />

          {/* Registro Docente */}
          <Card
            icon={<FaUsers className="text-black text-4xl mb-4" />}
            title="Registro de Docentes"
            description="Agrega o edita los docentes del sistema"
            bgColor="bg-purple-400/40 hover:bg-purple-300/60"
          />

          {/* Registro Estudiantes */}
          <Card
            icon={<FaGraduationCap className="text-black text-4xl mb-4" />}
            title="Registro de Estudiantes"
            description="Gestiona los estudiantes registrados"
            bgColor="bg-pink-300/40 hover:bg-pink-200/60"
          />

          {/* Configuración del sistema */}
          <Card
            icon={<FaCogs className="text-black text-4xl mb-4" />}
            title="Configuración"
            description="Ajustes generales del sistema"
            bgColor="bg-gray-300/50 hover:bg-gray-200"
          />
        </div>
      </div>
    </div>
  )
}

// Componente de tarjeta reutilizable
function Card({ icon, title, description, bgColor }: { icon: React.ReactNode, title: string, description: string, bgColor: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`w-75 ${bgColor} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer`}
    >
      {icon}
      <h2 className="text-xl font-semibold text-black">{title}</h2>
      <p className="text-sm text-black mt-2 text-center">{description}</p>
    </motion.div>
  )
}
