'use client';
import { useState } from 'react';
import ModalConfirmacion from '../modal/modalConfirmacion';
import Link from 'next/link';
export default function RestablecerContrasenaPage() {
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalStage, setModalStage] = useState<'sending' | 'success'>('sending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('resetToken');
    if (!token) {
      alert('Token no encontrado. Repita el proceso.');
      return;
    }

    try {
      setShowModal(true);
      setModalStage('sending');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al restablecer contraseña');

      // ✅ Cambiar texto dentro del modal
      setModalStage('success');

      setTimeout(() => {
        setShowModal(false);
        localStorage.removeItem('resetToken');
        localStorage.removeItem('recoveryEmail');
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      alert(error.message);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <ModalConfirmacion
        show={showModal}
        title={
          modalStage === 'sending'
            ? 'Restableciendo contraseña...'
            : 'Contraseña restablecida'
        }
        message={
          modalStage === 'sending'
            ? 'Por favor espere mientras procesamos la solicitud.'
            : 'Tu contraseña fue actualizada correctamente. Serás redirigido al inicio de sesión.'
        }
        autoClose={modalStage === 'sending'}
        stage={modalStage}
      />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-3 text-blue-800">Restablecer Contraseña</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="w-full border p-2 rounded-md mb-4"
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Guardar nueva contraseña
        </button>
        <Link href="/recuperarContrasena/verificarCodigo" className="block mt-4 text-blue-600 hover:underline text-sm">
          ← Volver a página anterior
        </Link>
      </form>
    </div>
  );
}
