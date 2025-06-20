'use client'
import { FaHome, FaUsers, FaUser, FaCog } from "react-icons/fa";
import BtnNavbar from "./btnNavbar";

export default function NavbarAdmin() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100 shadow flex-col  h-screen
">
      <BtnNavbar nombreTexto="Dasboard/home" icono={FaHome} ruta="/admin/home" />
      <BtnNavbar nombreTexto="Usuarios" icono={FaUsers} ruta="/auth/users" />
      <BtnNavbar nombreTexto="Roles" icono={FaCog} ruta="/auth/roles" />
      <BtnNavbar nombreTexto="Configuración" icono={FaCog} ruta="/configuracion" />
    </nav>
  );
}
