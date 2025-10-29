'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function IndexRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Siempre redirige al login
    const timer = setTimeout(() => {
      router.push('/auth/login')
    })

    return () => clearTimeout(timer)
  }, [router])


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4">
        </div>
        <p className="text-gray-600 text-lg">Redirigiendo al login...</p>
      </div>
    </div>)
}
