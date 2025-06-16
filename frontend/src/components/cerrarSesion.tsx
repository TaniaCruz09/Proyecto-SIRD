'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token') // Borra el token
    router.push('/auth/login') // Redirige al login
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Cerrar sesión
    </button>
  )
}
