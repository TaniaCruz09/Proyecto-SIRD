'use client';

import LogoutButton from "@/components/cerrarSesion";
import Navbar from "@/components/navbar";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar / Navbar */}
      <div className="w-1/3 bg-blue-100">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <div className="w-3/4 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Bienvenido Administrador</h1>
        <p className="mb-4">Esta es la vista principal del panel.</p>
        <LogoutButton />
      </div>
    </div>
  );
}
