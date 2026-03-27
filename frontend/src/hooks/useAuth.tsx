'use client'

import { createContext, useState, useEffect, ReactNode, useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SelectRole, logoutUser, refreshSession } from '@/actions/authMethods/loginMethods'
import { Docente } from '@/interfaces'
import { getUserById } from '@/actions/authMethods/usersMethods'
import { getDocenteById } from '@/actions/docentesMethods/docentesMethods'
import { useToast } from '@/hooks/use-toast'

interface AuthContextProps {
    rol: string | null
    roles: string[] // 🔹 array de nombres de rol
    docente: Docente | null
    login: (newRol?: string, newRoles?: string[], user?: any) => Promise<void>
    logout: (reason?: "idle" | "expired") => Promise<void>
    loading: boolean
    loadingAuth: boolean
    isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const { toast } = useToast()
    const [rol, setRol] = useState<string | null>(null)
    const [roles, setRoles] = useState<string[]>([])
    const [docente, setDocente] = useState<Docente | null>(null)
    const [hydrated, setHydrated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingAuth, setLoadingAuth] = useState(true)
    const [sessionActive, setSessionActive] = useState(false)
    const idleTimerRef = useRef<number | null>(null)
    const lastRefreshRef = useRef<number>(0)
    const logoutOnceRef = useRef(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)


    useEffect(() => {

        const initializeAuth = async () => {
            try {
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    setSessionActive(false)
                    setHydrated(true)
                    setLoading(false)
                    setLoadingAuth(false)
                    return
                }
                setSessionActive(true)
                logoutOnceRef.current = false
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
                    console.warn('Usuario con rol Docente sin relacion docente en /users/:id')
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
        setIsLoggingOut(false)
        try {
            setLoading(true)
            setLoadingAuth(true)
            setSessionActive(true)
            logoutOnceRef.current = false

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
                        const docenteId = fullUser?.docente?.id
                        if (docenteId) {
                            const d = await getDocenteById(Number(docenteId))
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
                                // Si no viene en getUserById, usar el id de la relacion si existe
                                const docenteId = fullUser?.docente?.id
                                if (docenteId) {
                                    const d = await getDocenteById(Number(docenteId))
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
    const logout = async (reason?: "idle" | "expired") => {
        if (logoutOnceRef.current) return
        logoutOnceRef.current = true

        setIsLoggingOut(true) // 🔥 ACTIVAS SPINNER GLOBAL

        try {
            await logoutUser()
            router.push('/auth/login')

        } catch (err) {
            console.error('Error en logout:', err)
        } finally {
            if (reason === "idle") {
                toast({
                    title: "Sesion finalizada",
                    description: "Se cerro la sesion por inactividad.",
                    variant: "warning",
                })
            }
            if (reason === "expired") {
                toast({
                    title: "Sesion expirada",
                    description: "Tu sesion expiro. Inicia sesion nuevamente.",
                    variant: "warning",
                })
            }
            setRol(null)
            setRoles([])
            setDocente(null)

            localStorage.removeItem('rol')
            localStorage.removeItem('roles')
            localStorage.removeItem('docente')
            localStorage.removeItem('userId')
            localStorage.removeItem('user')

            setSessionActive(false)
        }
    }

    useEffect(() => {
        if (!hydrated || !sessionActive) return

        const idleTimeoutMs = Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS) || 60 * 60 * 1000
        const refreshThrottleMs = Number(process.env.NEXT_PUBLIC_SESSION_REFRESH_MS) || 10 * 60 * 1000

        const clearIdleTimer = () => {
            if (idleTimerRef.current) {
                window.clearTimeout(idleTimerRef.current)
            }
        }

        const scheduleIdleTimer = () => {
            clearIdleTimer()
            idleTimerRef.current = window.setTimeout(() => {
                logout("idle")
            }, idleTimeoutMs)
        }

        const maybeRefresh = async () => {
            const now = Date.now()
            if (now - lastRefreshRef.current < refreshThrottleMs) return
            try {
                await refreshSession()
                lastRefreshRef.current = now
            } catch {
                logout("expired")
            }
        }

        const handleActivity = () => {
            scheduleIdleTimer()
            void maybeRefresh()
        }

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"]
        events.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }))

        scheduleIdleTimer()

        return () => {
            clearIdleTimer()
            events.forEach((eventName) => window.removeEventListener(eventName, handleActivity))
        }
    }, [hydrated, sessionActive])

    if (!hydrated) return null

    return (
        <AuthContext.Provider value={{ rol, roles, docente, login, logout, loading, loadingAuth, isLoggingOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
