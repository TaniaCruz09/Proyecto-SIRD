'use client'

import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { SelectRole, logoutUser } from '@/actions/authMethods/loginMethods'
import { Docente } from '@/interfaces'
import { getUserById } from '@/actions/authMethods/usersMethods'
import { getDocenteById } from '@/actions/docentesMethods/docentesMethods'

interface AuthContextProps {
    rol: string | null
    roles: string[] // 🔹 array de nombres de rol
    docente: Docente | null
    login: (newRol?: string, newRoles?: string[], user?: any) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
    loadingAuth: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const [rol, setRol] = useState<string | null>(null)
    const [roles, setRoles] = useState<string[]>([])
    const [docente, setDocente] = useState<Docente | null>(null)
    const [hydrated, setHydrated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    setHydrated(true)
                    setLoading(false)
                    setLoadingAuth(false)
                    return
                }
                const docenteStorage = localStorage.getItem("docente");
                if (docenteStorage) {
                    setDocente(JSON.parse(docenteStorage));
                }


                const user = await getUserById(Number(userId)) // 🔹 traemos usuario completo
                const userRoles = user.roles?.map((r: any) => (typeof r === 'string' ? r : r.rol)) || []

                setRoles(userRoles)
                localStorage.setItem('roles', JSON.stringify(userRoles))

                const lastRol = localStorage.getItem('rol') || userRoles[0] || null
                setRol(lastRol)
                if (lastRol) localStorage.setItem('rol', lastRol)

                if (user.docente) {
                    setDocente(user.docente)
                    localStorage.setItem('docente', JSON.stringify(user.docente))
                }
                else if (user.roles?.includes("Docente")) {
                    const d = await getDocenteById(user.id)   // ← tu endpoint que sí devuelve docente completo
                    if (d) {
                        setDocente(d)
                        localStorage.setItem('docente', JSON.stringify(d))
                    }
                }

            } catch (err) {
                console.error('Error inicializando auth:', err)
                router.push('/auth/login')
            } finally {
                setHydrated(true)
                setLoading(false)
                setLoadingAuth(false)
            }
        }

        initializeAuth()
    }, [router])

    const login = async (newRol?: string, newRoles?: string[], user?: any) => {
        try {
            setLoading(true)
            setLoadingAuth(true)

            if (newRoles) {
                setRoles(newRoles) // actualizamos roles disponibles
                localStorage.setItem('roles', JSON.stringify(newRoles))
            }
            if (user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.rol) === "Docente")) {
                const userId = user.id || localStorage.getItem('userId')
                if (userId) {
                    const fullUser = await getUserById(Number(userId))

                    if (fullUser.docente) {
                        setDocente(fullUser.docente)
                        localStorage.setItem('docente', JSON.stringify(fullUser.docente))
                    } else {
                        const d = await getDocenteById(Number(userId))
                        if (d) {
                            setDocente(d)
                            localStorage.setItem('docente', JSON.stringify(d))
                        }
                    }
                }
            }
            // 🔹 Si no viene user, intentar recuperarlo de localStorage
            let userData = user
            if (!userData) {
                const userStored = localStorage.getItem('user')
                userData = userStored ? JSON.parse(userStored) : null
            }

            // 🔹 Cargar docente si el usuario tiene ese rol
            if (userData) {
                const userRolesArray = userData.roles?.map((r: any) =>
                    typeof r === 'string' ? r : r.rol
                ) || []

                if (userRolesArray.includes("Docente")) {
                    const userId = userData.id || localStorage.getItem('userId')
                    if (userId) {
                        try {
                            // Primero intentar desde getUserById
                            const fullUser = await getUserById(Number(userId))

                            if (fullUser.docente) {
                                setDocente(fullUser.docente)
                                localStorage.setItem('docente', JSON.stringify(fullUser.docente))
                            } else {
                                // Si no viene en getUserById, llamar a getDocenteById
                                const d = await getDocenteById(Number(userId))
                                if (d) {
                                    setDocente(d)
                                    localStorage.setItem('docente', JSON.stringify(d))
                                }
                            }
                        } catch (error) {
                            console.error('Error cargando datos del docente:', error)
                        }
                    }
                }
            }
            if (newRol) {
                const response = await SelectRole({ role: newRol })
                setRol(response.role)
                localStorage.setItem('rol', response.role)
            }
        } catch (err) {
            console.error('Error en login:', err)
        } finally {
            setLoading(false)
            setLoadingAuth(false)
        }
    }
    const logout = async () => {
        try {
            setLoading(true)
            await logoutUser()
            setRol(null)
            setRoles([])
            setDocente(null)
            localStorage.removeItem('rol')
            localStorage.removeItem('roles')
            localStorage.removeItem('docente')
            localStorage.removeItem('userId')
            localStorage.removeItem('user')
            router.push('/auth/login')
        } catch (err) {
            console.error('Error en logout:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!hydrated) return null

    return (
        <AuthContext.Provider value={{ rol, roles, docente, login, logout, loading, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
