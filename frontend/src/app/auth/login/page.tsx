'use client'

import { saveLogin } from '@/actions/authMethods/loginMethods'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const searchParams = useSearchParams()
  const sessionExpired = searchParams.get('expired') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await saveLogin({ email, password })
      const { token, user } = data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // múltiples roles
      if (user.roles.length > 1) {
        localStorage.setItem('roles', JSON.stringify(user.roles))
        router.push("/auth/selectRole")
      } else {
        // un solo rol
        localStorage.setItem('rol', user.roles[0].rol) // ← guardamos string limpio
        router.push("/")
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status
        const message = err.response.data?.message || 'Error desconocido'

        if (status === 401) {
          setError(message)
        } else if (status) {
          setError(`Error del servidor: ${message}`)
        }
      } else {
        setError('Error de red, intenta de nuevo')
      }
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

            {error && <p className="text-red-500 text-center">{error}</p>}

            {sessionExpired && (
              <p className="text-yellow-600 bg-yellow-100 border border-yellow-300 p-3 rounded text-sm text-center">
                Tu sesión ha caducado. Por favor, inicia sesión nuevamente.
              </p>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-black"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-black"
              required
            />

            <p className="text-center text-sm text-gray-600">
              <a href="/recuperar-password" className="text-blue-600 hover:underline">
                ¿Olvidó su contraseña?
              </a>
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
    </div>
  )
}
