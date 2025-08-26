"use client";

import { memo, useEffect, useRef, useState } from "react";
import { FaHome, FaUsers, FaUser, FaUserPlus, FaCog, FaChevronDown } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";

const authSubmenu = [
  { label: "Usuarios", href: "/auth/users", icon: FaUser, roles: ["Admin"] },
  { label: "Roles", href: "/auth/roles", icon: FaUserPlus, roles: ["Admin"] },
];

const catalogSubmenu = [
  { label: "Niveles Académicos", href: "/catalogo/nivelAcademico", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Asignaturas", href: "/catalogo/asignatura", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Cortes", href: "/catalogo/corteEvaluativo", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Departamentos", href: "/catalogo/departamento", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Etnias", href: "/catalogo/etnia", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Género", href: "/catalogo/genero", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Grados", href: "/catalogo/grados", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Modalidades", href: "/catalogo/modalidad", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Municipios", href: "/catalogo/municipio", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Países", href: "/catalogo/pais", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Profesiones", href: "/catalogo/profesion", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Secciones", href: "/catalogo/seccion", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Semestres", href: "/catalogo/semestre", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Turnos", href: "/catalogo/turnos", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Años Lectivos", href: "/catalogo/anioLectivo", icon: FaUserPlus, roles: ["Admin"] },
];

const organizacionEscolarSubmenu = [
  { label: "Organizacion Escolar", href: "/organizacionEscolar/organizacion", icon: FaUser, roles: ["Admin"] },
  { label: "Grupos Educativos", href: "/organizacionEscolar/registerGroups", icon: FaUserPlus, roles: ["Admin"] },
  { label: "Grupos con Estudiantes", href: "/organizacionEscolar/gruposConEstudiantes", icon: FaUserPlus, roles: ["Admin"] },
];


function NavbarAdmin() {
  const pathname = usePathname();
  const [openUsers, setOpenUsers] = useState(false);
  const [openCatalogs, setOpenCatalogs] = useState(false);
  const [openOrganizacionEscolar, setOpenOrganizacionEscolar] = useState(false);
  const [rol, setRol] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Guarda la posición del scroll antes de cambiar de ruta
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll);
    }
  }, []);
  useEffect(() => {
    const storeRol = localStorage.getItem("rol");
    setRol(storeRol || "");
  }, []);

  // Guarda scroll actual antes de navegación
  const handleSaveScroll = () => {
    if (scrollRef.current) {
      sessionStorage.setItem("sidebar-scroll", scrollRef.current.scrollTop.toString());
    }
  };

  const isActive = (route: string) =>
    pathname === route
      ? "bg-indigo-600 text-white"
      : "text-white hover:bg-white hover:text-gray-900";

  // Rutas donde no quieres mostrar el navbar
  const rutasSinNavbar = ["/auth/login", "/auth/selectRole"];

  if (rutasSinNavbar.includes(pathname)) return null;
  if (!rol) return null;

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
        {organizacionEscolarSubmenu.some(item => item.roles.includes(rol!)) && (
          <>
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
                {authSubmenu
                  .filter(item => item.roles.includes(rol!)) // solo los que coinciden con rol
                  .map(({ label, href, icon: Icon }) => (
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
          </>
        )}

        {/* Catálogos */}
        {catalogSubmenu.some(item => item.roles.includes(rol!)) && (
          <>
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
                {catalogSubmenu
                  .filter(item => item.roles.includes(rol!)) // solo los que coinciden con rol
                  .map(({ label, href, icon: Icon }) => (
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
          </>
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
        {/* organizacion Escolar */}
        {organizacionEscolarSubmenu.some(item => item.roles.includes(rol!)) && (
          <>
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
                {organizacionEscolarSubmenu
                  .filter(item => item.roles.includes(rol!)) // solo los que coinciden con rol
                  .map(({ label, href, icon: Icon }) => (
                    <Link key={href} href={href} className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}>
                      <Icon className="text-base" />
                      {label}
                    </Link>
                  ))}
              </div>
            )}
          </>
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