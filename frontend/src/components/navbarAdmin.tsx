"use client";

import { memo, useEffect, useRef, useState } from "react";
import { FaHome, FaUsers, FaUser, FaUserPlus, FaCog, FaChevronDown } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const organizacionEscolarSubmenu = [
  { label: "Organizacion/Año lectivo", href: "/organizacionEscolar/anioLectivo", icon: FaUser },
  { label: "Grupos Educativos", href: "/organizacionEscolar/registerGroups", icon: FaUserPlus },
  { label: "Grupos con Estudiantes", href: "/organizacionEscolar/gruposConEstudiantes", icon: FaUserPlus },
];


function NavbarAdmin() {
  const pathname = usePathname();
  const [openUsers, setOpenUsers] = useState(true);
  const [openCatalogs, setOpenCatalogs] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Guarda la posición del scroll antes de cambiar de ruta
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll);
    }
  }, []);

  // Guarda scroll actual antes de navegación
  const handleSaveScroll = () => {
    if (scrollRef.current) {
      sessionStorage.setItem("sidebar-scroll", scrollRef.current.scrollTop.toString());
    }
  };
  const [openOrganizacionEscolar, setOpenOrganizacionEscolar] = useState(true);

  const isActive = (route: string) =>
    pathname === route
      ? "bg-indigo-600 text-white"
      : "text-white hover:bg-white hover:text-gray-900";

  return (
    <nav className="w-64 bg-gray-900 text-white h-screen overflow-hidden shadow-md">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto p-4 space-y-2"
      >
        {/* Home */}
        <Link
          href="/admin/home"
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/admin/home")}`}
          onClick={handleSaveScroll}
        >
          <FaHome />
          <span>Inicio</span>
        </Link>

        {/* Autenticación */}
        <button
          onClick={() => setOpenUsers(!openUsers)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition`}
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
              <Link
                key={href}
                href={href}
                scroll={false}
                className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}
                onClick={handleSaveScroll}
              >
                <Icon className="text-base" />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Catálogos */}
        <button
          onClick={() => setOpenCatalogs(!openCatalogs)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition`}
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
              <Link
                key={href}
                href={href}
                scroll={false}
                className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}
                onClick={handleSaveScroll}
              >
                <Icon className="text-base" />
                {label}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/registerDocente"
          scroll={false}
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/docentes")}`}
          onClick={handleSaveScroll}
        >
          <FaCog />
          <span>Docentes</span>
        </Link>

        <Link
          href="/registerEstudent"
          scroll={false}
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/student")}`}
          onClick={handleSaveScroll}
        >
          <FaCog />
          <span>Estudiantes</span>
        </Link>
        {/* <Link
          href="/notasEstudiantes"
          scroll={false}
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}
          onClick={handleSaveScroll}
        > */}
        {/* organizacion Escolar */}
        <button
          onClick={() => setOpenOrganizacionEscolar(!openOrganizacionEscolar)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition ${isActive("")}`}
        >
          <div className="flex items-center gap-3">
            <VscFileSubmodule />
            <span>Organizacion Escolar</span>
          </div>
          <FaChevronDown className={`${openOrganizacionEscolar ? "rotate-180" : ""} transition`} />
        </button>

        {openOrganizacionEscolar && (
          <div className="ml-6 flex flex-col gap-1">
            {organizacionEscolarSubmenu.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}>
                <Icon className="text-base" />
                {label}
              </Link>
            ))}
          </div>
        )}
        <Link href="/notasEstudiantes" className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}>
          <FaCog />
          <span>Calificaciones</span>
        </Link>

        <Link
          href="/docente/home"
          scroll={false}
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive("/estudiantes")}`}
          onClick={handleSaveScroll}
        >
          <FaCog />
          <span>Vista docente</span>
        </Link>
      </div>
    </nav>
  );
}


export default memo(NavbarAdmin);
