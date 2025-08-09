'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')

    if (!token || !rol) {
      localStorage.removeItem('token')
      localStorage.removeItem('rol')
      router.push('/auth/login?expired=true')
      return
    }

    // Redirigir según rol guardado
    switch (rol) {
      case 'Admin':
        router.push('admin/home')
        break
      case 'Docente':
        router.push('docente/home')
        break
      default:
        router.push('/auth/login') // o ruta genérica
    }
  }, [router])

  return <p>Redirigiendo...</p>
}
