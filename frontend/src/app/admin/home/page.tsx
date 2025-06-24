'use client';

import LogoutButton from "@/components/cerrarSesion";
import NavbarAdmin from "@/components/navbarAdmin";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-white">
      <div>
        <NavbarAdmin />
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Bienvenido Administrador</h1>
        <p className="mb-4">Esta es la vista principal del panel.</p>
        <LogoutButton />
      </div>
    </div>
  );
}
