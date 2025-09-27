'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaUserShield, FaChalkboardTeacher } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { JSX } from 'react/jsx-runtime'

interface Role {
  rol: string
  title: string
  description: string
  icon: JSX.Element
}

export default function SelectRolePage() {
  const router = useRouter()
  const { login, rol, loading } = useAuth() // usamos login para seleccionar rol y loading para skeleton
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')

  useEffect(() => {
    const storedRoles = localStorage.getItem('roles')
    if (!storedRoles) {
      router.push('/auth/login')
      return
    }

    try {
      const parsedRoles: Role[] = JSON.parse(storedRoles).map((r: any) => {
        if (r.rol === 'Admin') {
          return {
            ...r,
            title: 'Administrador',
            description: 'Administra el sistema completo',
            icon: <FaUserShield className="text-white text-2xl" />,
          }
        }
        if (r.rol === 'Docente') {
          return {
            ...r,
            title: 'Docente',
            description: 'Accede a tus clases y estudiantes',
            icon: <FaChalkboardTeacher className="text-white text-2xl" />,
          }
        }
        return r
      })

      setRoles(parsedRoles)
    } catch (error) {
      console.error('Error parseando roles desde localStorage:', error)
      router.push('/auth/login')
    }
  }, [router])

  const handleSubmit = async () => {
    if (!selectedRole) return
    await login(selectedRole) // login actualiza rol y localStorage

    // Redirigir según rol
    if (selectedRole === 'Admin') router.push('/admin/home')
    else if (selectedRole === 'Docente') router.push('/docente/home')
    else router.push('/auth/login')
  }

  // Skeleton mientras carga roles/rol actual
  if (loading || !roles.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-lg space-y-4">
          <div className="animate-pulse h-6 bg-gray-300 rounded"></div>
          <div className="animate-pulse h-6 bg-gray-300 rounded"></div>
          <div className="animate-pulse h-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Selecciona tu Rol</h1>
        <p className="text-center text-gray-600 mb-6">
          Tienes acceso a múltiples roles. Elige cómo deseas continuar:
        </p>

        <div className="grid grid-cols-1 gap-4">
          {roles.map((role, idx) => (
            <div
              key={role.rol + idx}
              onClick={() => setSelectedRole(role.rol)}
              className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl transition-shadow border
                ${selectedRole === role.rol ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-200 hover:shadow-md hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500">
                {role.icon}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{role.title}</h2>
                <p className="text-gray-600 text-sm">{role.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedRole}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continuar
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          🌟 Podrás cambiar de rol más tarde desde la configuración de tu perfil
        </p>
      </div>
    </div>
  )
}
