'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch {
    return true
  }
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')

    if (!token || !rol || isTokenExpired(token)) {
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
