'use client'

import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logoutUser, SelectRole } from '@/actions/authMethods/loginMethods'

interface AuthContextProps {
    rol: string | null
    login: (newRol?: string) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const [rol, setRol] = useState<string | null>(null)
    const [hydrated, setHydrated] = useState(false)
    const [loading, setLoading] = useState(true) // control de carga

    // Inicializar rol desde localStorage y backend
    const fetchRol = async () => {
        try {
            setLoading(true)

            // 🔸 Primero intenta obtener del backend
            const data = await getCurrentUser()

            const currentRol = data.user.roles?.[0] || null
            if (currentRol) {
                setRol(currentRol)
                localStorage.setItem("rol", currentRol)
            } else {
                setRol(null)
                localStorage.removeItem("rol")
            }
        } catch (err) {
            console.error("Error al obtener rol:", err)
            setRol(null)
            localStorage.removeItem("rol")
        } finally {
            setHydrated(true)
            setLoading(false)
        }
    }

    // Llamada inicial
    useEffect(() => {
        fetchRol()
    }, [])

    const login = async (newRol?: string) => {
        try {
            setLoading(true)
            if (newRol) {
                await SelectRole({ role: newRol })
            }
            await fetchRol()
        } catch (err) {
            console.error("Error al hacer login:", err)
            router.push("/auth/login")
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            setLoading(true)
            await logoutUser()
            setRol(null)
            localStorage.removeItem("rol")
            router.push("/auth/login")
        } catch (err) {
            console.error("Error en logout:", err)
        } finally {
            setLoading(false)
        }
    }

    if (!hydrated) return null

    return (
        <AuthContext.Provider value={{ rol, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
