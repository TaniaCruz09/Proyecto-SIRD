"use client"

import { useRouter } from "next/navigation";
import { IconType } from "react-icons";

interface BtnNavbarProps {
  // Define any props you need for the Navbar component
  nombreTexto: string;
  icono: IconType;
  ruta: string;
  
}

export default function BtnNavbar({ nombreTexto, icono:Icon, ruta }: BtnNavbarProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(ruta);// Redirige a la ruta especificada
  };
  return (
    <button
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      onClick={handleClick}
>
      <Icon size={20} />
      <span>{nombreTexto}</span>
    </button>
  )
}