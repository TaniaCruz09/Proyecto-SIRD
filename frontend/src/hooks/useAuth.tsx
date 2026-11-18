'use client'

import { createContext, useState, useEffect, ReactNode, useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentSession, SelectRole, switchRole as requestRoleSwitch, logoutUser, refreshSession } from '@/actions/authMethods/loginMethods'
import { hasRole, normalizeRole, normalizeRoles, ROL_DOCENTE } from '@/utils/roles'
import { Docente } from '@/interfaces'
import { getUserById } from '@/actions/authMethods/usersMethods'
import { useToast } from '@/hooks/use-toast'

interface AuthContextProps {
    rol: string | null
    roles: string[] // 🔹 array de nombres de rol
    docente: Docente | null
    login: (newRol?: string, newRoles?: string[], user?: any, selectRole?: boolean) => Promise<void>
    switchRole: (role: string) => Promise<void>
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
                const session = await getCurrentSession()
                localStorage.removeItem('token')

                if (session.roleSelectionRequired) {
                    const availableRoles = normalizeRoles(session.roles)
                    setRoles(availableRoles)
                    setRol(null)
                    localStorage.setItem('roles', JSON.stringify(availableRoles))
                    localStorage.setItem('userId', String(session.user.id))
                    localStorage.setItem('user', JSON.stringify(session.user))
                    setSessionActive(false)
                    if (window.location.pathname !== '/auth/selectRole') {
                        router.replace('/auth/selectRole')
                    }
                    return
                }

                const userId = session.user?.id
                const activeRole = normalizeRole(session.activeRole)
                if (!userId || !activeRole) {
                    throw new Error('La sesión no contiene un usuario y rol válidos')
                }

                setSessionActive(true)
                logoutOnceRef.current = false
                const userRoles = normalizeRoles(session.roles)
                const user = session.user
                setRoles(userRoles)
                setRol(activeRole)
                localStorage.setItem('roles', JSON.stringify(userRoles))
                localStorage.setItem('rol', activeRole)
                localStorage.setItem('userId', String(userId))
                localStorage.setItem('user', JSON.stringify(user))

                if (window.location.pathname === '/auth/selectRole') {
                    router.replace(activeRole === 'Admin' ? '/admin/home' : '/docente/home')
                }

                const fullUser = await getUserById(Number(userId))
                if (fullUser.docente) {
                    setDocente(fullUser.docente)
                    localStorage.setItem('docente', JSON.stringify(fullUser.docente))
                } else if (hasRole([activeRole], ROL_DOCENTE)) {
                    setDocente(null)
                    localStorage.removeItem('docente')
                    console.warn('Usuario con rol Docente sin relacion docente en /users/:id')
                } else {
                    setDocente(null)
                    localStorage.removeItem('docente')
                }

            } catch (err) {
                setSessionActive(false)
                setRol(null)
                setRoles([])
                setDocente(null)
                localStorage.removeItem('token')
                localStorage.removeItem('rol')
                localStorage.removeItem('roles')
                localStorage.removeItem('docente')
                localStorage.removeItem('userId')
                localStorage.removeItem('user')
                const pathname = window.location.pathname
                const publicRoute =
                    pathname === '/' ||
                    pathname.startsWith('/auth/') ||
                    pathname.startsWith('/recuperarContrasena')
                if (!publicRoute) {
                    console.error('Error inicializando auth:', err)
                    router.replace('/auth/login')
                }
            } finally {
                setHydrated(true)
                setLoading(false)
                setLoadingAuth(false)
            }
        }

        initializeAuth()
    }, [router])

    const login = async (
        newRol?: string,
        newRoles?: string[],
        user?: any,
        selectRole = true,
    ) => {
        setIsLoggingOut(false)
        try {
            setLoading(true)
            setLoadingAuth(true)
            logoutOnceRef.current = false
            localStorage.removeItem('token')

            if (newRoles) {
                setRoles(newRoles) // actualizamos roles disponibles
                localStorage.setItem('roles', JSON.stringify(newRoles))
            }
            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.setItem('userId', String(user.id))
            }
            if (newRol) {
                const response = selectRole
                    ? await SelectRole({ role: newRol })
                    : { role: newRol }
                const rolCanonico = normalizeRole(response.role)
                setRol(rolCanonico)
                localStorage.setItem('rol', rolCanonico)
                const assignedRoles = normalizeRoles(
                    response.roles ?? newRoles ?? user?.roles,
                )
                const currentRoles = assignedRoles.length
                    ? assignedRoles
                    : [rolCanonico]
                setRoles(currentRoles)
                localStorage.setItem('roles', JSON.stringify(currentRoles))
                setSessionActive(true)
                if (hasRole([rolCanonico], ROL_DOCENTE)) {
                    const userId = user?.id || localStorage.getItem('userId')
                    if (userId) {
                        const fullUser = await getUserById(Number(userId))
                        setDocente(fullUser.docente ?? null)
                        if (fullUser.docente) {
                            localStorage.setItem('docente', JSON.stringify(fullUser.docente))
                        } else {
                            localStorage.removeItem('docente')
                        }
                    }

                } else {
                    setDocente(null)
                    localStorage.removeItem('docente')
                }
            }
        } catch (err) {
            console.error('Error en login:', err)
            throw err
        } finally {
            setLoading(false)
            setLoadingAuth(false)
        }
    }

    const switchRole = async (newRole: string) => {
        setLoading(true)
        setLoadingAuth(true)
        try {
            const response = await requestRoleSwitch({ role: newRole })
            const activeRole = normalizeRole(response.role)
            const assignedRoles = normalizeRoles(response.roles)
            setRol(activeRole)
            setRoles(assignedRoles)
            setSessionActive(true)
            localStorage.setItem('rol', activeRole)
            localStorage.setItem('roles', JSON.stringify(assignedRoles))
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user))
                localStorage.setItem('userId', String(response.user.id))
            }

            if (hasRole([activeRole], ROL_DOCENTE) && response.user?.id) {
                const fullUser = await getUserById(Number(response.user.id))
                setDocente(fullUser.docente ?? null)
                if (fullUser.docente) {
                    localStorage.setItem('docente', JSON.stringify(fullUser.docente))
                } else {
                    localStorage.removeItem('docente')
                }
            } else {
                setDocente(null)
                localStorage.removeItem('docente')
            }
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
            localStorage.removeItem('token')

            setSessionActive(false)
            router.replace('/auth/login')
            setIsLoggingOut(false)
            logoutOnceRef.current = false
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
        <AuthContext.Provider value={{ rol, roles, docente, login, switchRole, logout, loading, loadingAuth, isLoggingOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return context
}
