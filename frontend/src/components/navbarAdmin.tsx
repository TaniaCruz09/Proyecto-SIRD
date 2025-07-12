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
  { label: "Niveles Académicos", href: "/catalogo/nivelAcademico", icon: FaUserPlus },
  { label: "Asignaturas", href: "/catalogo/asignatura", icon: FaUserPlus },
  { label: "Cortes", href: "/catalogo/corteEvaluativo", icon: FaUserPlus },
  { label: "Departamentos", href: "/catalogo/departamento", icon: FaUserPlus },
  { label: "Etnias", href: "/catalogo/etnia", icon: FaUserPlus },
  { label: "Género", href: "/catalogo/genero", icon: FaUserPlus },
  { label: "Grados", href: "/catalogo/grados", icon: FaUserPlus },
  { label: "Modalidades", href: "/catalogo/modalidad", icon: FaUserPlus },
  { label: "Municipios", href: "/catalogo/municipio", icon: FaUserPlus },
  { label: "Países", href: "/catalogo/pais", icon: FaUserPlus },
  { label: "Profesiones", href: "/catalogo/profesion", icon: FaUserPlus },
  { label: "Secciones", href: "/catalogo/seccion", icon: FaUserPlus },
  { label: "Semestres", href: "/catalogo/semestre", icon: FaUserPlus },
  { label: "Turnos", href: "/catalogo/turnos", icon: FaUserPlus },
  { label: "Años Lectivos", href: "/catalogo/anioLectivo", icon: FaUserPlus },
];
// const SchoolOrganizacionSubmenu = [
//   { label: "Grupos", href: "/SchoolOrganization/grupos", icon: FaUserPlus },
//   { label: "Asignaturas", href: "/catalogos/asignaturas", icon: FaUserPlus },
//   { label: "Cortes", href: "/catalogos/cortes", icon: FaUserPlus },
//   { label: "Departamentos", href: "/catalogos/departamentos", icon: FaUserPlus },
//   { label: "Etnias", href: "/catalogos/etnias", icon: FaUserPlus },
//   { label: "Género", href: "/catalogos/genero", icon: FaUserPlus },
//   { label: "Grados", href: "/catalogos/grados", icon: FaUserPlus },
//   { label: "Modalidades", href: "/catalogos/modalidades", icon: FaUserPlus },
//   { label: "Municipios", href: "/catalogos/municipios", icon: FaUserPlus },
//   { label: "Países", href: "/catalogo/country", icon: FaUserPlus },
//   { label: "Profesiones", href: "/catalogos/profesiones", icon: FaUserPlus },
//   { label: "Secciones", href: "/catalogos/secciones", icon: FaUserPlus },
//   { label: "Semestres", href: "/catalogos/semestres", icon: FaUserPlus },
//   { label: "Turnos", href: "/catalogos/turnos", icon: FaUserPlus },
// ];

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

        <Link href="/registerStudents" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}>
          <FaCog />
          <span>Estudiantes</span>
        </Link>

        <Link href="/notasEstudiantes" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}>
          <FaCog />
          <span>Grupos escolares</span>
        </Link>
        <Link href="/docente/home" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}>
          <FaCog />
          <span>vista docente</span>
        </Link>
      </div>
    </nav>
  );
}
