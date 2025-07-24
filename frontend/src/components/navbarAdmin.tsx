"use client";

import { useState } from "react";
import { FaHome, FaUsers, FaUser, FaUserPlus, FaCog, FaChevronDown } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🔸 Submenús configurables
const authSubmenu = [
  { label: "Usuarios", href: "/auth/users", icon: FaUser },
  { label: "Roles", href: "/auth/roles", icon: FaUserPlus },
];

const catalogSubmenu = [
  { label: "Niveles Académicos", href: "/catalogos/niveles-academicos", icon: FaUserPlus },
  { label: "Asignaturas", href: "/catalogos/asignaturas", icon: FaUserPlus },
  { label: "Cortes", href: "/catalogos/cortes", icon: FaUserPlus },
  { label: "Departamentos", href: "/catalogos/departamentos", icon: FaUserPlus },
  { label: "Etnias", href: "/catalogos/etnias", icon: FaUserPlus },
  { label: "Género", href: "/catalogos/genero", icon: FaUserPlus },
  { label: "Grados", href: "/catalogos/grados", icon: FaUserPlus },
  { label: "Modalidades", href: "/catalogos/modalidades", icon: FaUserPlus },
  { label: "Municipios", href: "/catalogos/municipios", icon: FaUserPlus },
  { label: "Países", href: "/catalogo/country", icon: FaUserPlus },
  { label: "Profesiones", href: "/catalogos/profesiones", icon: FaUserPlus },
  { label: "Secciones", href: "/catalogos/secciones", icon: FaUserPlus },
  { label: "Semestres", href: "/catalogos/semestres", icon: FaUserPlus },
  { label: "Turnos", href: "/catalogos/turnos", icon: FaUserPlus },
];
const SchoolOrganizacionSubmenu = [
  { label: "Grupos", href: "/SchoolOrganization/grupos", icon: FaUserPlus },
  { label: "Asignaturas", href: "/catalogos/asignaturas", icon: FaUserPlus },
  { label: "Cortes", href: "/catalogos/cortes", icon: FaUserPlus },
  { label: "Departamentos", href: "/catalogos/departamentos", icon: FaUserPlus },
  { label: "Etnias", href: "/catalogos/etnias", icon: FaUserPlus },
  { label: "Género", href: "/catalogos/genero", icon: FaUserPlus },
  { label: "Grados", href: "/catalogos/grados", icon: FaUserPlus },
  { label: "Modalidades", href: "/catalogos/modalidades", icon: FaUserPlus },
  { label: "Municipios", href: "/catalogos/municipios", icon: FaUserPlus },
  { label: "Países", href: "/catalogo/country", icon: FaUserPlus },
  { label: "Profesiones", href: "/catalogos/profesiones", icon: FaUserPlus },
  { label: "Secciones", href: "/catalogos/secciones", icon: FaUserPlus },
  { label: "Semestres", href: "/catalogos/semestres", icon: FaUserPlus },
  { label: "Turnos", href: "/catalogos/turnos", icon: FaUserPlus },
];

export default function NavbarAdmin() {
  const pathname = usePathname();
  const [openUsers, setOpenUsers] = useState(false);
  const [openCatalogs, setOpenCatalogs] = useState(false);

  const isActive = (route: string) =>
    pathname === route ? "bg-indigo-600 text-white" : "text-white hover:bg-white hover:text-gray-900";

  return (
    <nav className="w-64 bg-gray-900 text-white h-screen overflow-hidden shadow-md">
      <div className="h-full overflow-y-auto p-4 space-y-2">
        {/* Home */}
        <Link href="/admin/home" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/admin/home")}`}>
          <FaHome />
          <span>Dashboard</span>
        </Link>

        {/* Autenticación */}
        <button
          onClick={() => setOpenUsers(!openUsers)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition ${isActive("")}`}
        >
          <div className="flex items-center gap-3">
            <FaUsers />
            <span>Autenticación</span>
          </div>
          <FaChevronDown className={`${openUsers ? "rotate-180" : ""} transition`} />
        </button>

        {openUsers && (
          <div className="ml-6 flex flex-col gap-1">
            {authSubmenu.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}>
                <Icon className="text-base" />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Catálogos */}
        <button
          onClick={() => setOpenCatalogs(!openCatalogs)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition ${isActive("")}`}
        >
          <div className="flex items-center gap-3">
            <VscFileSubmodule />
            <span>Catálogos</span>
          </div>
          <FaChevronDown className={`${openCatalogs ? "rotate-180" : ""} transition`} />
        </button>

        {openCatalogs && (
          <div className="ml-6 flex flex-col gap-1">
            {catalogSubmenu.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}>
                <Icon className="text-base" />
                {label}
              </Link>
            ))}
          </div>
        )}

        <Link href="/registerDocente" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/docentes")}`}>
          <FaCog />
          <span>Docentes</span>
        </Link>

        <Link href="/registerEstudent" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/student")}`}>
          <FaCog />
          <span>Estudiantes</span>
        </Link>

        {/* <Link href="/registerStudents" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}>
          <FaCog />
          <span>organizacion Escolar</span>
        </Link> */}
      </div>
    </nav>
  );
}
