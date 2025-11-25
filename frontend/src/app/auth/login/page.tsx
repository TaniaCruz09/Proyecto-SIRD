'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { saveLogin } from '@/actions/authMethods/loginMethods'
import { useAuth } from '@/hooks/useAuth'
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
      const { user, roles, autoSelectRole } = res

      // Guardar datos del usuario
      localStorage.setItem('userId', String(user.id))
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('roles', JSON.stringify(roles))

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
      setError(err.response?.data?.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-gray-50 to-purple-100 px-4">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full border border-purple-200"
        >
          <img
            src="/logo_actual_instituto_ruben_dario.png"
            alt="Mi logo"
            className="w-20 h-auto mx-auto drop-shadow-xl mb-4"
          />
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-center text-blue-900/90">Iniciar Sesión</h1>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-black"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-black pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setSowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              <Link
                href="/recuperarContrasena"
                onClick={() => {
                  if (email) localStorage.setItem('recoveryEmail', email)
                }}
                className="text-blue-600 hover:underline"
              >
                ¿Olvidó su contraseña?
              </Link>
            </p>


            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl hover:from-sky-600 hover:to-blue-700 transition shadow-lg font-semibold"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
      {/* Modal flotante */}
      {error && (
        <AlertCard
          type="error"
          title="Error al iniciar sesión"
          message='El usario ingresado no es valido'
          buttonText="Intentar de nuevo"
          onAction={() => setError(null)}
          show={!!error}
        />
      )}
    </div>
  )
}
