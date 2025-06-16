'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')

    console.log('Token:', token)
    console.log('Rol:', rol)

    if (token && rol) {
      // Redirigir según rol guardado
      switch (rol) {
        case 'Admin':
          router.push('admin/dashboard')
          break
        case 'Docente':
          router.push('docente/home')
          break
        default:
          router.push('/auth/login') // o ruta genérica
      }
    } else {
      router.push('/auth/login')
    }
  }, [router])

  return <p>Redirigiendo...</p>
}
