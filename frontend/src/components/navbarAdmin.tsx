'use client'

import { memo, useEffect, useRef, useState } from 'react'
import {
  FaBars,
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
  FaExchangeAlt,
  FaGraduationCap,
  FaHome,
  FaLayerGroup,
  FaListAlt,
  FaTimes,
  FaMapMarkedAlt,
  FaSchool,
  FaSitemap,
  FaUser,
  FaUserFriends,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
  FaVenusMars,
} from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ConfirmModal from "@/app/recuperarContrasena/modal/modalCambioRol"
import CerrarSecion from '@/components/cerrarSesion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Menús solo para Admin
const authSubmenu = [
  { label: 'Usuarios', href: '/auth/users', icon: FaUserFriends },
  { label: 'Roles', href: '/auth/roles', icon: FaUserShield },
]

const catalogSubmenu = [
  { label: 'Años Lectivos', href: '/catalogo/anioLectivo', icon: FaCalendarAlt },
  { label: 'Tipos de Periodos', href: '/catalogo/tipoPeriodizacion', icon: FaLayerGroup },
  { label: 'Asignaturas', href: '/catalogo/asignatura', icon: FaBook },
  { label: 'Cortes', href: '/catalogo/corteEvaluativo', icon: FaChartLine },
  { label: 'Departamentos', href: '/catalogo/departamento', icon: FaBuilding },
  { label: 'Etnias', href: '/catalogo/etnia', icon: FaFlag },
  { label: 'Sexos', href: '/catalogo/genero', icon: FaVenusMars },
  { label: 'Grados', href: '/catalogo/grados', icon: FaGraduationCap },
  { label: 'Modalidades', href: '/catalogo/modalidad', icon: FaLayerGroup },
  { label: 'Municipios', href: '/catalogo/municipio', icon: FaMapMarkedAlt },
  { label: 'Notas Cualitativas', href: '/catalogo/notas-cualitativas', icon: FaChartLine },
  { label: 'Niveles Académicos', href: '/catalogo/nivelAcademico', icon: FaChartLine },
  { label: 'Paises', href: '/catalogo/pais', icon: FaFlag },
  { label: 'Profesiones', href: '/catalogo/profesion', icon: FaBriefcase },
  { label: 'Secciones', href: '/catalogo/seccion', icon: FaColumns },
  { label: 'Turnos', href: '/catalogo/turnos', icon: FaClock },
  { label: 'Centro Educativo', href: '/catalogo/centro', icon: FaSchool },
]

const organizacionEscolarSubmenu = [
  { label: 'Organizacion Escolar', href: '/organizacion', icon: FaUser },
  { label: 'Grupos Educativos', href: '/registerGroups', icon: FaChalkboardTeacher },
  { label: 'Promoción de estudiantes', href: '/promocion', icon: FaUserGraduate },
]

function NavbarAdmin() {
  const router = useRouter()
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [openUsers, setOpenUsers] = useState(false)
  const [openCatalogs, setOpenCatalogs] = useState(false)
  const [openOrganizacionEscolar, setOpenOrganizacionEscolar] = useState(false)

  const { rol, login, roles, loading, docente } = useAuth()
  const [cambiandoRol, setCambiandoRol] = useState(false)
  const [rolDestino, setRolDestino] = useState<'Admin' | 'Docente' | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    setMenuAbierto(false)
  }, [pathname])
  const [nuevoRol, setNuevoRol] = useState<'Admin' | 'Docente'>(() => {
    // valor por defecto seguro si rol no está listo aún
    return rol === 'Docente' ? 'Admin' : 'Docente'
  })
  const rolesArray = roles ? (Array.isArray(roles) ? roles : [roles]) : []
  const tieneMultiplesRoles = rolesArray.length > 1 // 🔹 aquí traemos el rol actual y la función para cambiarlo

  useEffect(() => {
    setOpenUsers(false)
    setOpenCatalogs(false)
    setOpenOrganizacionEscolar(false)
  }, [rol])

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar-scroll')
    if (savedScroll && scrollRef.current) scrollRef.current.scrollTop = parseInt(savedScroll)
  }, [])

  useEffect(() => {
    const userStored = localStorage.getItem('user')
    if (!userStored) return

    try {
      const user = JSON.parse(userStored)
      setNombreUsuario(user?.name ?? '')
    } catch {
      setNombreUsuario('')
    }
  }, [])

  useEffect(() => {
    // cuando cambien roles o rol actualiza nuevoRol por si el hook se inicializa después del login
    if (!rol) return
    const current = String(rol).toLowerCase()
    const other = rolesArray.find(r => String(r).toLowerCase() !== current)
    if (other) setNuevoRol(String(other).toLowerCase() === 'admin' ? 'Admin' : 'Docente')
    else setNuevoRol(current === 'admin' ? 'Docente' : 'Admin')
  }, [roles, rol])

  useEffect(() => {
    if (!cambiandoRol || !rolDestino || loading) return

    const rutaDestino = rolDestino === 'Admin' ? '/admin/home' : '/docente/home'
    if (rol === rolDestino && pathname === rutaDestino) {
      setCambiandoRol(false)
      setRolDestino(null)
    }
  }, [cambiandoRol, loading, pathname, rol, rolDestino])

  const handleSaveScroll = () => {
    if (scrollRef.current) sessionStorage.setItem('sidebar-scroll', scrollRef.current.scrollTop.toString())
  }

  const getDocenteInitials = () => {
    if (!docente) return 'DC'
    const nombre = docente.nombres?.trim()?.[0] ?? ''
    const apellido = docente.apellido_paterno?.trim()?.[0] ?? ''
    return `${nombre}${apellido}`.toUpperCase() || 'DC'
  }

  const nombreDocente = docente
    ? `${docente.nombres} ${docente.apellido_paterno} ${docente.apellido_materno || ''}`.trim()
    : 'Docente'

  const profesionDocente = docente?.profession?.length
    ? docente.profession.map((p: any) => p.profession).join(', ')
    : 'Profesión no registrada'

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`)
      ? 'text-sky-400 translate-x-1'
      : 'text-gray-300 hover:text-sky-300 hover:translate-x-2'

  const rutasSinNavbar = ['/', '/auth/login', '/auth/selectRole', '/recuperarContrasena',
    '/recuperarContrasena/verificarCodigo', '/recuperarContrasena/restablecerContrasena']
  if (rutasSinNavbar.includes(pathname)) return null

  // Skeleton mientras carga rol
  if (loading && !cambiandoRol) {
    return (
      <nav className="w-64 bg-gray-900 text-white h-screen p-4 space-y-2">
        <div className="animate-pulse h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="animate-pulse h-6 bg-gray-700 rounded mb-2 w-1/2"></div>
        <div className="animate-pulse h-6 bg-gray-700 rounded mb-2 w-2/3"></div>
      </nav>
    )
  }

  if (!rol) return null

  const handleAbrirModal = () => {
    if (!rol) return
    const current = String(rol).toLowerCase()
    const other = rolesArray.find(r => String(r).toLowerCase() !== current)
    setNuevoRol(other ? (String(other).toLowerCase() === 'admin' ? 'Admin' : 'Docente') : (rol === 'Admin' ? 'Docente' : 'Admin'))
    setIsModalOpen(true)
  }

  const handleConfirmarCambio = async () => {
    setIsModalOpen(false)
    setRolDestino(nuevoRol)
    setCambiandoRol(true)

    try {
      await login(nuevoRol)
      await new Promise(r => setTimeout(r, 100))
      router.replace(nuevoRol === 'Admin' ? '/admin/home' : '/docente/home')
    } catch (error) {
      console.error('Error cambiando rol:', error)
      setCambiandoRol(false)
      setRolDestino(null)
    }
  }

  return (
    <>
      {cambiandoRol && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f1f2f4]">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-xl">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-lg font-semibold text-gray-800">Cambiando de rol...</p>
            <p className="mt-1 text-sm text-gray-500">
              {(rolDestino ?? nuevoRol) === 'Admin' ? 'Cargando vista de administrador.' : 'Cargando vista de docente.'}
            </p>
          </div>
        </div>
      )}

      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú de navegación"
          aria-expanded={menuAbierto}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50"
        >
          <FaBars className="h-4 w-4" />
        </button>
        <span className="truncate text-sm font-semibold text-slate-800">
          {nombreUsuario || nombreDocente || 'Sistema SIRD'}
        </span>
      </header>

      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-70 shrink-0 flex-col overflow-hidden bg-gray-900 text-white shadow-md transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}
      >
        <button
          type="button"
          onClick={() => setMenuAbierto(false)}
          aria-label="Cerrar menú de navegación"
          className="absolute right-3 top-3 z-10 rounded-md p-1 text-slate-400 transition hover:text-white lg:hidden"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
          {rol === 'Admin' && (
            <div className="mb-4 border-b border-slate-700 pb-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-400">Administrador</p>
              <p className="mt-1 text-sm font-semibold text-white">{nombreUsuario || 'Usuario'}</p>
            </div>
          )}

          {rol === 'Docente' && (
            <div className="mb-4 border-b border-slate-700 pb-4 text-center">
              <Avatar className="mx-auto h-24 w-24 border-2 border-sky-300/70">
                {docente?.foto_docente ? (
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${docente.foto_docente}`}
                    alt={nombreDocente}
                  />
                ) : null}
                <AvatarFallback className="bg-sky-100 text-lg font-bold text-sky-700">
                  {getDocenteInitials()}
                </AvatarFallback>
              </Avatar>
              <p className="mt-3 text-sm font-semibold text-white">{nombreDocente}</p>
              <p className="mt-1 text-xs text-sky-200">{profesionDocente}</p>
            </div>
          )}

          {/* Solo Admin */}
          {rol === 'Admin' && (
            <>
              <Link
                href="/admin/home"
                className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/admin/home')}`}
                onClick={handleSaveScroll}
              >
                <FaHome />
                <span className="whitespace-nowrap">Home Admin</span>
              </Link>

              <button
                onClick={() => setOpenUsers(!openUsers)}
                className="flex items-center justify-between p-3 w-full rounded-md transition"
              >
                <div className="flex items-center gap-3">
                  <FaUserShield />
                  <span className="whitespace-nowrap">Gestión de Acceso</span>
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
                  <span className="whitespace-nowrap">Catálogos</span>
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
                  <span className="whitespace-nowrap">Organización Escolar</span>
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
                className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/docente/registerDocente')}`}
              >
                <FaChalkboardTeacher />
                <span className="whitespace-nowrap">Registro Docente</span>
              </Link>

              <Link
                href="/registerEstudent"
                className={`flex items-center gap-3 p-3 rounded-md transition-transform duration-200 ${isActive('/registerEstudent')}`}
              >
                <FaUserGraduate />
                <span className="whitespace-nowrap">Registro Estudiante</span>
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
              <span className="whitespace-nowrap">Home Docente</span>
            </Link>
          )}
        </div>

        <div className="border-t border-slate-700 bg-slate-900/90 p-4 space-y-3">
          <Button
            onClick={handleAbrirModal}
            disabled={cambiandoRol || !tieneMultiplesRoles}
            className="w-full justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 py-1.5 text-sm font-semibold text-slate-100 shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaExchangeAlt className="text-xs" />
            {tieneMultiplesRoles
              ? (rol === 'Admin' ? 'Cambiar a rol Docente' : 'Cambiar a rol Admin')
              : 'No hay otro rol disponible'}
          </Button>

          <CerrarSecion />

          <ConfirmModal
            isOpen={isModalOpen}
            title="Cambiar Rol"
            message={`¿Estás seguro que quieres cambiar tu rol a ${nuevoRol}?`}
            onConfirm={handleConfirmarCambio}
            onCancel={() => !cambiandoRol && setIsModalOpen(false)}
          />
        </div>
      </nav>
    </>
  )
}

export default memo(NavbarAdmin)
