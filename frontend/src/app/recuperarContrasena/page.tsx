'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestPasswordReset } from '@/actions/authMethods/loginMethods'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // 🔹 Al montar, cargar correo guardado (si existe)
  useEffect(() => {
    const savedEmail = localStorage.getItem('recoveryEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      localStorage.removeItem('recoveryEmail') // opcional, limpiar después
    }
  }, [])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage('')
  setError('')

  try {
    const response = await requestPasswordReset(email)
    console.log('response:', response) // <--- revisa qué devuelve realmente tu backend

    if (response?.success || response?.status === 200) {
      setMessage('✅ Código de recuperación enviado. Revise su correo.')
      localStorage.setItem('recoveryEmail', email)
      // Redirigir automáticamente a la página de verificación
      router.push('/verificarCodigo') // <-- ajusta si tu carpeta se llama diferente
    } else {
      setError(response?.message || 'No se pudo enviar el código.')
      router.push('/recuperarContrasena/verificarCodigo') // <-- ajusta si tu carpeta se llama diferente

    }
  } catch (err: any) {
    console.error('Error al enviar el código:', err)
    setError('Error en la solicitud. Intente de nuevo.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Recuperación de Contraseña
        </h1>
        <p className="text-gray-600 mb-6">
          {email
            ? <>Le enviaremos un código al correo <strong>{email}</strong> para restablecer su contraseña.</>
            : <>Ingrese su correo. Le enviaremos un código para restablecer su contraseña.</>}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresar el correo"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full bg-blue-600 text-white py-3 rounded-xl transition ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>

        {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <Link href="/" className="block mt-4 text-blue-600 hover:underline text-sm">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
