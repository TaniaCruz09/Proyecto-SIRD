'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CerrarSecion() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token') // Borra el token
    router.push('/auth/login') // Redirige al login
  }

  return (
    <button
      onClick={handleLogout}
      className=" flex items-center justify-between gap-x-2 bg-white hover:bg-red-500 shadow-sm rounded-lg px-3 py-2 text-black font-medium transition"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>

  )
}
