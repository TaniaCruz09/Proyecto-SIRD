'use client'

import { saveLogin } from '@/actions/authMethods/loginMethods'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Resetear error previo

    // const login = async (formData: FormData) => {
    //   "use server"
    //   const data = await saveLogin(formData);

    //   revalidatePath("/auth/login");
    // }

    // console.log(login);

    // Enviar datos al backend
    try {
      const response = await fetch('http://localhost:5003/api/v1/auth/login', {  // RUTA API en Next.js
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('DATA:', data)

      if (response.ok) {
       const { token, user } = data
        // Guardar en localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('rol', user.roles?.[0]?.rol || '')
        localStorage.setItem('user', JSON.stringify(user))

        // Redirigir según el rol
  switch (user.roles?.[0]?.rol) {
    case 'Admin':
      router.push('/admin/dashboard')
      break
    case 'Docente':
      router.push('/docente/home')
      break
    default:
      router.push('/')
  }
      } else {
        // Mostrar error
        setError(data.message || 'Algo salió mal')
      }
    } catch (err) {
      setError('Error de red, intenta de nuevo')
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
        <img src="/logo_actual_instituto_ruben_dario.png" alt="Mi logo" className='w-20 h-auto mx-auto'/>
        <h1 className="text-2xl font-bold text-center text-blue-600">Inicia Sesión</h1>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Mensaje de error */}

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
          <a href="/crear la pagina" className="text-blue-600 hover:underline">
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
