'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '@/actions/authMethods/loginMethods';
import ModalConfirmacion from './modal/modalConfirmacion';

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('recoveryEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestPasswordReset(email);
      localStorage.setItem('recoveryEmail', email);

      setShowModal(true);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        setShowModal(false);
        router.push('/recuperarContrasena/verificarCodigo');
      }, 3000);
    } catch (err: any) {
      const message =
        err?.message ||
        'Ocurrió un error al enviar el código. Intenta nuevamente.';
      setError(message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50">
      {/* 🔹 Modal de confirmación */}
      <ModalConfirmacion
        show={showModal}
        title="Código enviado"
        message="Hemos enviado un código de verificación al correo:"
        email={email}
        autoClose={true}
        showSpinner={true}
      />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Recuperación de Contraseña
        </h1>
        <p className="text-gray-600 mb-6">
          {email
            ? <>Le enviaremos un código al correo para restablecer su contraseña.</>
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
            className={`mt-4 w-full bg-blue-600 text-white py-3 rounded-xl transition ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <Link href="/" className="block mt-4 text-blue-600 hover:underline text-sm">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
