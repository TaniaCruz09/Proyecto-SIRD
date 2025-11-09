'use client';
import { verifyResetCode } from '@/actions/authMethods/loginMethods';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function VerificarCodigoPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('recoveryEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    console.log('Verificando código para:', email);

    try {
      const res = await verifyResetCode(email, code);

      if (res?.success || res?.status === 200) {
        // guarda token o algo que devuelva el backend
        if (res?.resetToken) {
          localStorage.setItem('resetToken', res.resetToken);
        }
        router.push('/recuperarContrasena/restablecerContrasena');
      } else {
        setError(res?.message || 'Código inválido o expirado.');
      }
    } catch (err: any) {
      console.error('Error al verificar el código:', err);
      setError('Error en la solicitud. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
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
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Verificar
        </button>
      </form>
    </div>
  );
}
