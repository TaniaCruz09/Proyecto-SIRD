'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { saveLogin } from '@/actions/authMethods/loginMethods'
import { setAuthCookie } from '@/actions/authMethods/authCookie'
import { useAuth } from '@/hooks/useAuth'
import { normalizeRoles } from '@/utils/roles'
import Link from 'next/link'
import AlertCard from '@/components/alertReutilizable/AlertCard'

export default function LoginPage() {
  const router = useRouter()
  const { login, } = useAuth() 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setSowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
  
      const res = await saveLogin({ email, password })
      const { user, autoSelectRole, token } = res
      // Normaliza los roles ('docente' -> 'Docente') para que el resto del sistema funcione igual
      const roles = normalizeRoles(res.roles)

      // Guardar datos del usuario
      localStorage.setItem('userId', String(user.id))
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('roles', JSON.stringify(roles))

      // Guardar token para peticiones autenticadas y cookie para el middleware (producción)
      if (token) {
        localStorage.setItem('token', token)
        await setAuthCookie(token)
      }

      if (autoSelectRole && roles && roles.length === 1) {
        // ✅ Pasar roles al contexto y seleccionar rol automáticamente
        const selected = roles[0]
        localStorage.setItem('rol', selected)
        await login(selected, roles, user)
        router.push(selected === 'Admin' ? '/admin/home' : '/docente/home')
      } else {
        // ✅ Guardar roles en contexto y redirigir a selección
        await login(undefined, roles, user)
        router.push('/auth/selectRole')
      }
    } catch (err: any) {
      console.log('Error al iniciar sesión:', err)
      setError(err?.message || err?.response?.data?.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f1f2f4] p-4 text-left sm:p-6">
      {/* Resplandor suave de fondo */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#8f8ffb]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#c7d2fe]/40 blur-3xl" />

      <div className="relative w-full max-w-5xl rounded-[2rem] bg-white p-3 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] sm:p-4">
        <div className="relative grid w-full gap-4 md:grid-cols-2">
          {/* Panel izquierdo (escritorio) */}
          <aside className="relative hidden flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#5b5bf5] p-10 text-white md:flex">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/10" />

            <div className="relative">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                SIRD
              </span>
              <h2 className="mt-6 text-[2rem] font-bold leading-tight">
                Sistema de
                <br />
                Calificaciones
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
                Administra estudiantes, docentes, grupos y calificaciones.
              </p>
               <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
                Instituto Rubén Darío
              </p>
            </div>

            <div className="relative mt-10 flex flex-1 items-center justify-center">
              <div className="flex h-44 w-44 items-center justify-center rounded-[1.75rem] bg-white/95 p-7 shadow-2xl shadow-indigo-950/25">
                <img
                  src="/logo_actual_instituto_ruben_dario.png"
                  alt="Logo del instituto"
                  className="h-full w-auto"
                />
              </div>
            </div>
          </aside>

          {/* Formulario */}
          <section className="flex items-center justify-center px-2 py-8 sm:px-6 md:py-12">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[#5b5bf5]">SIRD</span>
              </div>

              <h1 className="mt-7 text-center text-3xl font-bold text-slate-900">Bienvenido de nuevo</h1>
              <p className="mt-2 text-center text-sm text-slate-500">
                Inicia sesión con tu cuenta para continuar
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="login-email" className="sr-only">
                    Correo
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo"
                    disabled={loading}
                    className="w-full rounded-xl border border-transparent bg-[#f4f5f7] px-4 py-3.5 text-slate-900 placeholder:text-slate-400 transition focus:border-[#5b5bf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5b5bf5]/15 disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="sr-only">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
                      disabled={loading}
                      className="w-full rounded-xl border border-transparent bg-[#f4f5f7] px-4 py-3.5 pr-12 text-slate-900 placeholder:text-slate-400 transition focus:border-[#5b5bf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5b5bf5]/15 disabled:opacity-60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 transition hover:text-slate-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/recuperarContrasena"
                    onClick={() => {
                      if (email) localStorage.setItem('recoveryEmail', email)
                    }}
                    className="text-xs font-medium text-slate-500 transition hover:text-[#5b5bf5]"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b5bf5] py-3.5 font-semibold text-white shadow-lg shadow-[#5b5bf5]/25 transition hover:bg-[#4a4ae0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-slate-400">
                SIRD · Sistema de Calificaciones — Instituto Rubén Darío
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Modal flotante */}
      {error && (
        <AlertCard
          type="error"
          title="Error al iniciar sesión"
          message={error ?? 'El usuario ingresado no es válido'}
          buttonText="Intentar de nuevo"
          onAction={() => setError(null)}
          show={!!error}
        />
      )}
    </div>
  )
}
