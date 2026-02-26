'use client'

import { memo, useEffect, useRef, useState } from 'react'
import {
  FaBook,
  FaBriefcase,
  FaBuilding,
  FaCalendar,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaChartLine,
  FaChevronDown,
  FaClock,
  FaColumns,
  FaFlag,
  FaGraduationCap,
  FaHome,
  FaLayerGroup,
  FaListAlt,
  FaMapMarkedAlt,
  FaSchool,
  FaSitemap,
  FaUserFriends,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
  FaVenusMars,
} from 'react-icons/fa'
import { VscFileSubmodule } from 'react-icons/vsc'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// Menús solo para Admin
const authSubmenu = [
  { label: 'Usuarios', href: '/auth/users', icon: FaUserFriends },
  { label: 'Roles', href: '/auth/roles', icon: FaUserShield },
]

const catalogSubmenu = [
  { label: 'Años Lectivos', href: '/catalogo/anioLectivo', icon: FaCalendarAlt },
  { label: 'Asignaturas', href: '/catalogo/asignatura', icon: FaBook },
  { label: 'Cortes', href: '/catalogo/corteEvaluativo', icon: FaChartLine },
  { label: 'Departamentos', href: '/catalogo/departamento', icon: FaBuilding },
  { label: 'Etnias', href: '/catalogo/etnia', icon: FaFlag },
  { label: 'Sexos', href: '/catalogo/genero', icon: FaVenusMars },
  { label: 'Grados', href: '/catalogo/grados', icon: FaGraduationCap },
  { label: 'Modalidades', href: '/catalogo/modalidad', icon: FaLayerGroup },
  { label: 'Municipios', href: '/catalogo/municipio', icon: FaMapMarkedAlt },
  { label: 'Niveles Académicos', href: '/catalogo/nivelAcademico', icon: FaChartLine },
  { label: 'Paises', href: '/catalogo/pais', icon: FaFlag },
  { label: 'Profesiones', href: '/catalogo/profesion', icon: FaBriefcase },
  { label: 'Secciones', href: '/catalogo/seccion', icon: FaColumns },
  { label: 'Semestres', href: '/catalogo/semestre', icon: FaCalendar },
  { label: 'Turnos', href: '/catalogo/turnos', icon: FaClock },
  { label: 'Centro Educativo', href: '/catalogo/centro', icon: FaSchool },
]

const organizacionEscolarSubmenu = [
  // { label: 'Organizacion Escolar', href: '/organizacion', icon: FaUser },
  { label: 'Grupos Educativos', href: '/registerGroups', icon: FaChalkboardTeacher },
]

function NavbarAdmin() {
  const pathname = usePathname()
  const { rol, loading } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [openUsers, setOpenUsers] = useState(false)
  const [openCatalogs, setOpenCatalogs] = useState(false)
  const [openOrganizacionEscolar, setOpenOrganizacionEscolar] = useState(false)

  useEffect(() => {
    setOpenUsers(false)
    setOpenCatalogs(false)
    setOpenOrganizacionEscolar(false)
  }, [rol])

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar-scroll')
    if (savedScroll && scrollRef.current) scrollRef.current.scrollTop = parseInt(savedScroll)
  }, [])

  const handleSaveScroll = () => {
    if (scrollRef.current) sessionStorage.setItem('sidebar-scroll', scrollRef.current.scrollTop.toString())
  }

  const isActive = (route: string) =>
    pathname === route
      ? 'text-sky-400 translate-x-1'
      : 'text-gray-300 hover:text-sky-300 hover:translate-x-2'

  const rutasSinNavbar = ['/', '/auth/login', '/auth/selectRole', '/recuperarContrasena', 
    '/recuperarContrasena/verificarCodigo','/recuperarContrasena/restablecerContrasena']
  if (rutasSinNavbar.includes(pathname)) return null

  // Skeleton mientras carga rol
  if (loading) {
    return (
      <nav className="w-64 bg-gray-900 text-white h-screen p-4 space-y-2">
        <div className="animate-pulse h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="animate-pulse h-6 bg-gray-700 rounded mb-2 w-1/2"></div>
        <div className="animate-pulse h-6 bg-gray-700 rounded mb-2 w-2/3"></div>
      </nav>
    )
  }

  if (!rol) return null

  return (
    <nav className="w-70 bg-gray-900 text-white h-screen overflow-hidden shadow-md">
      <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-2">
        {/* Solo Admin */}
        {rol === 'Admin' && (
          <>
            <Link
              href="/admin/home"
              className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/admin/home')}`}
              onClick={handleSaveScroll}
            >
              <FaHome />
              <span>Home Admin</span>
            </Link>

            <button
              onClick={() => setOpenUsers(!openUsers)}
              className="flex items-center justify-between p-3 w-full rounded-md transition"
            >
              <div className="flex items-center gap-3">
                <FaUserShield />
                <span>Autenticación</span>
              </div>
              <FaChevronDown className={`${openUsers ? 'rotate-180' : ''} transition`} />
            </button>
            {openUsers && (
              <div className="ml-6 flex flex-col gap-1">
                {authSubmenu.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-transform duration-200 ${isActive(href)}`}
                    onClick={handleSaveScroll}
                  >
                    <Icon className="text-base" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => setOpenCatalogs(!openCatalogs)}
              className="flex items-center justify-between p-3 w-full rounded-md transition"
            >
              <div className="flex items-center gap-3">
                <FaListAlt />
                <span>Catálogos</span>
              </div>
              <FaChevronDown className={`${openCatalogs ? 'rotate-180' : ''} transition`} />
            </button>
            {openCatalogs && (
              <div className="ml-6 flex flex-col gap-1">
                {catalogSubmenu.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-transform duration-200 ${isActive(href)}`}
                    onClick={handleSaveScroll}
                  >
                    <Icon className="text-base" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => setOpenOrganizacionEscolar(!openOrganizacionEscolar)}
              className="flex items-center justify-between p-3 w-full rounded-md transition"
            >
              <div className="flex items-center gap-3">
                <FaSitemap />
                <span>Organización Escolar</span>
              </div>
              <FaChevronDown className={`${openOrganizacionEscolar ? 'rotate-180' : ''} transition`} />
            </button>
            {openOrganizacionEscolar && (
              <div className="ml-6 flex flex-col gap-1">
                {organizacionEscolarSubmenu.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-transform duration-200 ${isActive(href)}`}
                    onClick={handleSaveScroll}
                  >
                    <Icon className="text-base" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/docente/registerDocente"
              className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/esquela-calificaciones')}`}
            >
              <FaChalkboardTeacher />
              <span>Registro Docente</span>
            </Link>

            <Link
              href="/registerEstudent"
              className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/esquela-calificaciones')}`}
            >
              <FaUserGraduate />
              <span>Registro Estudiante</span>
            </Link>
          </>
        )}

        {/* Solo Docentes */}
        {rol === 'Docente' && (
          <Link
            href="/docente/home"
            className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/docente/home')}`}
            onClick={handleSaveScroll}
          >
            <FaHome />
            <span>Home Docente</span>
          </Link>
        )}

        {/* Links compartidos 
        <Link
          href="/calificaciones"
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive('/calificaciones')}`}
        >
          <FaCog />
          <span>Calificaciones</span>
        </Link>*/}
      </div>
    </nav>
  )
}

export default memo(NavbarAdmin)

