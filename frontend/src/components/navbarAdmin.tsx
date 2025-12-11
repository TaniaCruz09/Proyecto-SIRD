'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { FaHome, FaUsers, FaUser, FaUserPlus, FaCog, FaChevronDown } from 'react-icons/fa'
import { VscFileSubmodule } from 'react-icons/vsc'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// Menús solo para Admin
const authSubmenu = [
  { label: 'Usuarios', href: '/auth/users', icon: FaUser },
  { label: 'Roles', href: '/auth/roles', icon: FaUserPlus },
]

const catalogSubmenu = [
  { label: 'Años Lectivos', href: '/catalogo/anioLectivo', icon: FaUserPlus },
  { label: 'Asignaturas', href: '/catalogo/asignatura', icon: FaUserPlus },
  { label: 'Cortes', href: '/catalogo/corteEvaluativo', icon: FaUserPlus },
  { label: 'Departamentos', href: '/catalogo/departamento', icon: FaUserPlus },
  { label: 'Etnias', href: '/catalogo/etnia', icon: FaUserPlus },
  { label: 'Sexos', href: '/catalogo/genero', icon: FaUserPlus },
  { label: 'Grados', href: '/catalogo/grados', icon: FaUserPlus },
  { label: 'Modalidades', href: '/catalogo/modalidad', icon: FaUserPlus },
  { label: 'Municipios', href: '/catalogo/municipio', icon: FaUserPlus },
  { label: 'Niveles Académicos', href: '/catalogo/nivelAcademico', icon: FaUserPlus },
  { label: 'Paises', href: '/catalogo/pais', icon: FaUserPlus },
  { label: 'Profesiones', href: '/catalogo/profesion', icon: FaUserPlus },
  { label: 'Secciones', href: '/catalogo/seccion', icon: FaUserPlus },
  { label: 'Semestres', href: '/catalogo/semestre', icon: FaUserPlus },
  { label: 'Turnos', href: '/catalogo/turnos', icon: FaUserPlus },
]

const organizacionEscolarSubmenu = [
  { label: 'Organizacion Escolar', href: '/organizacion', icon: FaUser },
  { label: 'Grupos Educativos', href: '/registerGroups', icon: FaUserPlus },
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
    pathname === route ? 'bg-indigo-600 text-white' : 'text-white hover:bg-white hover:text-gray-900'

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
              className={`flex items-center gap-3 p-3 rounded-md transition ${isActive('/admin/home')}`}
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
                <FaUsers />
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
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}
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
                <VscFileSubmodule />
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
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition ${isActive(href)}`}
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
                <VscFileSubmodule />
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
              href="/docente/registerDocente"
              className={`flex items-center gap-3 p-3 rounded-md transition ${isActive('/esquela-calificaciones')}`}
            >
              <FaHome />
              <span>Registro Docente</span>
            </Link>

            <Link
              href="/registerEstudent"
              className={`flex items-center gap-3 p-3 rounded-md transition ${isActive('/esquela-calificaciones')}`}
            >
              <FaHome />
              <span>Registro Estudiante</span>
            </Link>
          </>
        )}

        {/* Solo Docentes */}
        {rol === 'Docente' && (
          <Link
            href="/docente/home"
            className={`flex items-center gap-3 p-3 rounded-md transition ${isActive('/docente/home')}`}
            onClick={handleSaveScroll}
          >
            <FaHome />
            <span>Home Docente</span>
          </Link>
        )}

        {/* Links compartidos */}
        <Link
          href="/calificaciones"
          className={`flex items-center gap-3 p-3 rounded-md transition ${isActive('/calificaciones')}`}
        >
          <FaCog />
          <span>Calificaciones</span>
        </Link>
      </div>
    </nav>
  )
}

export default memo(NavbarAdmin)

