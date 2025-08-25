'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  allowedRoles: string[]
  children: React.ReactNode
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')

    if (!token || !rol || !allowedRoles.includes(rol)) {
      router.push('/auth/login?expired=true')
    }
  }, [router, allowedRoles])

  return <>{children}</>
}
