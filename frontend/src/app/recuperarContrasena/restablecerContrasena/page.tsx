'use client';
import { useState } from 'react';

export default function RestablecerContrasenaPage() {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('resetToken');

    if (!token) {
      alert('Token no encontrado. Repita el proceso.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al restablecer contraseña');

      alert('Contraseña actualizada correctamente');
      localStorage.removeItem('resetToken');
      localStorage.removeItem('recoveryEmail');
      window.location.href = '/';
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
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
      </form>
    </div>
  );
}
