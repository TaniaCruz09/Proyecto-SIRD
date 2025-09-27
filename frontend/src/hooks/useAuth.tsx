'use client'

import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { SelectRole, logoutUser } from '@/actions/authMethods/loginMethods'
import { Docente } from '@/interfaces'

interface AuthContextProps {
    rol: string | null
    docente: Docente | null
    login: (newRol?: string) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const [rol, setRol] = useState<string | null>(null)
    const [docente, setDocente] = useState<Docente | null>(null)
    const [hydrated, setHydrated] = useState(false)
    const [loading, setLoading] = useState(true)

    // Inicializar desde localStorage si existe
    useEffect(() => {
        const storedRol = localStorage.getItem('rol')
        if (storedRol) setRol(storedRol)
        setHydrated(true)
        setLoading(false)
    }, [])

    const login = async (newRol?: string) => {
        try {
            setLoading(true)
            let userData: any = null

            if (newRol) {
                // Llamada a SelectRole si se pasa un rol
                const response = await SelectRole({ role: newRol })
                userData = response.user
                setRol(response.role)
                localStorage.setItem('rol', response.role)
            }

            // Actualizar docente si existe
            if (userData?.docente) setDocente(userData.docente)
        } catch (err) {
            console.error('Error al hacer login:', err)
            router.push('/auth/login')
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            setLoading(true)
            await logoutUser()
            setRol(null)
            setDocente(null)
            localStorage.removeItem('rol')
            router.push('/auth/login')
        } catch (err) {
            console.error('Error en logout:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!hydrated) return null

    return (
        <AuthContext.Provider value={{ rol, docente, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
