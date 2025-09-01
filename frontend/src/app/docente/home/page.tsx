'use client'

import { FaChartBar, FaUsers, FaCogs } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import CerrarSecion from '@/components/cerrarSesion'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="mx-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-2xl font-bold text-blue-900 drop-shadow-md mb-6">
          Página de inicio
        </h2>
        <CerrarSecion />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 drop-shadow-md mb-6">
        Bienvenido Docente al Sistema de Calificaciones SIRD
      </h2>
      <p className="text-lg text-blue-800 mb-12">
        Accede fácilmente a tus funciones principales desde aquí
      </p>

      <div className="flex items-center bg-white rounded-t-xl pl-3 font-semibold text-black">
        <FaArrowUpRightFromSquare />
        <p className="pl-2">
          Accesos directos
        </p>
      </div>
      {/* Tarjetas de acceso directo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center bg-white border rounded-b-xl p-8">
        {/* Tarjeta 1 */}
        <Card
          icon={<FaChartBar className="text-black text-4xl mb-4" />}
          title="Calificaciones"
          description="Consulta el avance académico de los estudiantes"
          bgColor='bg-green-600/50 hover:bg-green-500/70" hover:shadow-2xl'
          href='/calificaciones'
        />

        {/* Tarjeta 2 */}
        <Card
          icon={<FaUsers className="text-black text-4xl mb-4" />}
          title="Gestión de Estudiantes"
          description="Administra los datos de los estudiantes fácilmente"
          bgColor='bg-yellow-500/40 hover:shadow-2xl hover:bg-yellow-400/60'
          href='estudiantes/registerEstudent'
        />

        {/* Tarjeta 3 */}
        <Card
          icon={<FaCogs className="text-black text-4xl mb-4" />}
          title="onfiguración"
          description="Ajustes del sistema y gestión de usuarios"
          bgColor='bg-blue-500/30 hover:shadow-2xl hover:bg-blue-400/50'
          href='/admin/configuracion'
        />
      </div>
    </div>
  )
}

// Componente de tarjeta reutilizable
function Card({ icon, title, description, bgColor, href }: { icon: React.ReactNode, title: string, description: string, bgColor: string, href: string }) {
  return (
    <Link href={href}>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={`w-75 ${bgColor} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer`}
      >
        {icon}
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        <p className="text-sm text-black mt-2 text-center">{description}</p>
      </motion.div>
    </Link>
  )
}

