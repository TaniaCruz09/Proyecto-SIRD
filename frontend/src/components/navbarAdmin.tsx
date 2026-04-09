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
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ConfirmModal from "@/app/recuperarContrasena/modal/modalCambioRol"
import CerrarSecion from '@/components/cerrarSesion'

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
  const router = useRouter()
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [openUsers, setOpenUsers] = useState(false)
  const [openCatalogs, setOpenCatalogs] = useState(false)
  const [openOrganizacionEscolar, setOpenOrganizacionEscolar] = useState(false)

  const { rol, login, roles, loading, isLoggingOut } = useAuth()
  const [cambiandoRol, setCambiandoRol] = useState(false)
  const [rolDestino, setRolDestino] = useState<'Admin' | 'Docente' | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const isActive = (route: string) =>
    pathname === route
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-lg font-semibold text-gray-800">Cambiando de rol...</p>
            <p className="mt-1 text-sm text-gray-500">
              {(rolDestino ?? nuevoRol) === 'Admin' ? 'Cargando vista de administrador.' : 'Cargando vista de docente.'}
            </p>
          </div>
        </div>
      )}

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

          {/* Botón para cambiar rol */}
          {tieneMultiplesRoles && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAbrirModal}
                disabled={cambiandoRol}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {rol === 'Admin' ? 'Cambiar a rol Docente' : 'Cambiar a rol Admin'}
              </Button>


              <ConfirmModal
                isOpen={isModalOpen}
                title="Cambiar Rol"
                message={`¿Estás seguro que quieres cambiar tu rol a ${nuevoRol}?`}
                onConfirm={handleConfirmarCambio}
                onCancel={() => !cambiandoRol && setIsModalOpen(false)}
              />
            </div>
          )}

          <CerrarSecion />

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
        </div>
      </nav>
    </>
  )
}

export default memo(NavbarAdmin)

