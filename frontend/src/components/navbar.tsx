'use client'
import { FaHome, FaUser, FaCog } from "react-icons/fa";
import BtnNavbar from "./btnNavbar";

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100 shadow flex-col  h-screen
">
      <BtnNavbar nombreTexto="Inicio" icono={FaHome} ruta="/auth/login" />
      <BtnNavbar nombreTexto="Perfil" icono={FaUser} ruta="/perfil" />
      <BtnNavbar nombreTexto="Configuración" icono={FaCog} ruta="/configuracion" />
    </nav>
  );
}
