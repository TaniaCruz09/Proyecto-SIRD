'use client'

import { saveLogin } from '@/actions/authMethods/loginMethods'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('Docente') // rol por defecto
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await saveLogin({ email, password })
      const { token, user } = data

      // Guardar token y rol en localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('rol', selectedRole)
      localStorage.setItem('user', JSON.stringify(user))

      // Redirigir según rol seleccionado
      if (selectedRole === 'admin') {
        router.push('/admin/home')
      } else if (selectedRole === 'docente') {
        router.push('/docente/dashboard')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status
        const message = err.response.data?.message || 'Error desconocido'

        if (status === 401) setError(message)
        else setError(`Error del servidor: ${message}`)
      } else {
        setError('Error de red, intenta de nuevo')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6"
      >
        <img
          src="/logo_actual_instituto_ruben_dario.png"
          alt="Mi logo"
          className="w-20 h-auto mx-auto"
        />
        <h1 className="text-2xl font-bold text-center text-blue-600">
          Inicia Sesión
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

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

        {/* Selector de rol */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-black"
        >
          <option value="docente">Docente</option>
          <option value="admin">Admin</option>
        </select>

        <p className="text-center text-sm text-gray-600">
          <a
            href="/recuperar-contrasena"
            className="text-blue-600 hover:underline"
          >
            ¿Olvidó su contraseña?
          </a>
        </p>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
