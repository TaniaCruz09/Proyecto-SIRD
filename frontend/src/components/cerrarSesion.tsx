'use client'

import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function CerrarSesion() {
  const { logout } = useAuth()

  return (
    <button
      onClick={logout}
      className="flex items-center justify-between gap-x-2 bg-white hover:bg-red-500 shadow-sm rounded-lg px-3 py-2 text-black font-medium transition"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  )
}
