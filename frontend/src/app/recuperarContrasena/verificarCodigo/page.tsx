'use client';
import { verifyResetCode } from '@/actions/authMethods/loginMethods';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ModalConfirmacion from '../modal/modalConfirmacion';
import Link from 'next/link';

export default function VerificarCodigoPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('recoveryEmail');
    console.log('Email guardado en localStorage:', savedEmail);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const savedEmail = email || localStorage.getItem('recoveryEmail');
    if (!savedEmail) {
      setError('Email no encontrado. Reinicie el proceso de recuperación.');
      setLoading(false);
      return;
    }

    try {
      const res = await verifyResetCode(savedEmail, code);
      console.log('respuesta del backend', res);

      if (res?.token) {
        console.log('✅ Token recibido del backend:', res.token);
        localStorage.setItem('resetToken', res.token);

        //modal de confirmacion 
        setShowModal(true)

        setTimeout(() => {
          setShowModal(false)
          router.push('/recuperarContrasena/restablecerContrasena');
        }, 3000)

      } else {
        setError('Código inválido o expirado.');
      }
    } catch (err: any) {
      console.error('Error al verificar el código:', err);
      setError(err.response?.data?.message || err.message || 'Error en la solicitud. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <ModalConfirmacion
        show={showModal}
        title='verificando codigo'
        message='Espera un momento mientras verificamos'
        autoClose={true}
      />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-3 text-blue-800">Codigo de verificacion</h1>
        <p className="text-gray-600 mb-4">
          Ingrese el código enviado al correo <strong>{email}</strong>.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de verificación"
          className="w-full border p-2 rounded-md mb-4"
          required
        />
        {/* Mensaje de error */}
        {error && (
          <div
            className="relative mb-4 p-4 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-md animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white rounded-full p-1.5 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M12 5a7 7 0 110 14 7 7 0 010-14z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {message && (
          <div
            className="relative mb-4 p-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-md animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white rounded-full p-1.5 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Verificar
        </button>

        <Link href="/recuperarContrasena" className="block mt-4 text-blue-600 hover:underline text-sm">
          ← Volver a página anterior
        </Link>
      </form>
    </div>
  );
}
