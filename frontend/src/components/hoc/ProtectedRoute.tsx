'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  allowedRoles: string[]
  children: React.ReactNode
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const router = useRouter()
  const { rol, loadingAuth } = useAuth()

  useEffect(() => {
    if (!loadingAuth && (!rol || !allowedRoles.includes(rol))) {
      router.push('/auth/login?expired=true')
    }
  }, [router, allowedRoles, loadingAuth, rol])

  if (loadingAuth || !rol || !allowedRoles.includes(rol)) return null

  return <>{children}</>
}
