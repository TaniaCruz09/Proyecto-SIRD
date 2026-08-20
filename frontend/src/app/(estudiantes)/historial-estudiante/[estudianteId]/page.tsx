"use client"
import { useEffect, useState } from "react"
import { getEstudentById } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods"
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CalendarDays,
    GraduationCap,
    Phone,
    MapPin,
    CreditCard,
    User,
    ChevronDown,
    ChevronRight,
} from "lucide-react"
import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import EditStudentModal from "@/components/modals/Estudiantes/EditStudentModal"
import { useParams } from "next/navigation"
import { TablaRegistrosEstudiante } from "@/components/tables/expedientes/Tabla-registros-estudiante"
import { getEsquelaByGrupo } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods";

export interface RegistroAcademico {
    id: string
    grado: string
    modalidad: string
    grupo: string
    docenteGuia: string
    anioLectivo: string
    activo: boolean
}

export default function StudentProfile() {

    const [studentData, setStudentData] = useState<RegisterEstudent | null>(null)
    const [registros, setRegistros] = useState<RegistroAcademico[]>([])
    const [notasHistoricas, setNotasHistoricas] = useState<any[]>([])
    const [notasExpandidas, setNotasExpandidas] = useState(false)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    const { estudianteId } = useParams()

    const handleVerCalificaciones = async (grupoId: string) => {
        try {

            const esquela = await getEsquelaByGrupo(Number(grupoId))

            if (!esquela?.id) {
                console.error("No existe esquela para este grupo")
                return
            }

            router.push(
                `/esquela-calificaciones/${esquela.id}?estudianteId=${estudianteId}`
            )

        } catch (error) {
            console.error("Error obteniendo esquela", error)
        }
    }

    const fetchEstudianteById = async () => {
        try {

            const student = await getEstudentById(Number(estudianteId))

            // Crear registros académicos sin duplicados
            const registrosMap = new Map<string, RegistroAcademico>()

            student.grupoAsignaturaConEstudiantes.forEach((item: any) => {

                const grupoAsignaturaDocente = item.grupoAsignaturaDocente
                if (!grupoAsignaturaDocente) return

                const grupo = grupoAsignaturaDocente.grupo
                if (!grupo) return

                const anioLectivo = grupo.organizacionEscolar?.anio_lectivo
                if (!anioLectivo) return

                const key = `${grupo.id}-${anioLectivo.anio_lectivo}`

                if (!registrosMap.has(key)) {

                    const docenteGuia = grupo.docenteGuia
                        ? `${grupo.docenteGuia.nombres} ${grupo.docenteGuia.apellido_paterno}`
                        : "Sin docente guía"

                    registrosMap.set(key, {
                        id: grupo.id.toString(),
                        grado: grupo.grado?.grades ?? "Sin grado",
                        modalidad: grupo.organizacionEscolar?.turno?.modalidad?.modalidad ?? grupo.modalidad ?? "Sin modalidad",
                        grupo: grupo.id,
                        docenteGuia,
                        anioLectivo: anioLectivo.anio_lectivo.toString(),
                        activo: anioLectivo.isActive
                    })

                }

            })

            const registrosAcademicos: RegistroAcademico[] = Array.from(registrosMap.values())

            const studentWithDate: RegisterEstudent = {
                ...student,
                dateBirt: new Date(student.dateBirt),
            }

            setStudentData(studentWithDate)
            setRegistros(registrosAcademicos)

            // Construir mapa de materias actuales del estudiante: grupoId → Set<asignaturaId>
            const materiasActuales = new Map<number, Set<number>>()
            student.grupoAsignaturaConEstudiantes?.forEach((item: any) => {
                const gad = item.grupoAsignaturaDocente
                if (!gad?.grupo?.id || !gad?.asignatura?.id) return
                const grupoId = Number(gad.grupo.id)
                const asigId = Number(gad.asignatura.id)
                if (!materiasActuales.has(grupoId)) {
                    materiasActuales.set(grupoId, new Set())
                }
                materiasActuales.get(grupoId)!.add(asigId)
            })

            // Cargar notas históricas del estudiante y clasificarlas
            const aniosUnicos = [...new Set(registrosAcademicos.map(r => r.anioLectivo))]
            const todasLasNotas: any[] = []
            for (const anio of aniosUnicos) {
                try {
                    const notas = await getEsquelaRowByEstudianteAndAnio(Number(estudianteId), Number(anio))
                    todasLasNotas.push(...notas)
                } catch (error) {
                    console.error(`Error cargando notas del año ${anio}:`, error)
                }
            }

            // Clasificar cada nota:
            // - Se construye un SET con TODAS las asignaturas que el estudiante tiene actualmente (en todos sus grupos)
            // - Si una nota tiene una asignatura que NO está en ese set → es huérfana (quedó de un grupo anterior)
            const todasLasAsignaturasActuales = new Set<number>()
            materiasActuales.forEach((subjects) => {
                subjects.forEach(id => todasLasAsignaturasActuales.add(id))
            })

            const notasClasificadas = todasLasNotas.map((nota: any) => {
                const asigId = nota.asignatura?.id
                const esHuerfana = !!(asigId && todasLasAsignaturasActuales.size > 0 && !todasLasAsignaturasActuales.has(Number(asigId)))
                const grupo = nota.esquelaHead?.grupo_asignatura
                const gradoNombre = grupo?.grado?.grades ?? ""
                const seccionNombre = grupo?.seccion?.seccion ?? ""
                return {
                    ...nota,
                    esHuerfana,
                    grupoOrigenNombre: (gradoNombre || seccionNombre)
                        ? `${gradoNombre} - ${seccionNombre}`.replace(/^ - | - $/g, "").trim()
                        : grupo?.id
                            ? `Grupo #${grupo.id}`
                            : "—"
                }
            })

            console.log("🧪 Todas las asignaturas actuales:", [...todasLasAsignaturasActuales])

            setNotasHistoricas(notasClasificadas)

        } catch (error) {
            console.error("Error cargando estudiante", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEstudianteById()
    }, [])

    if (loading) {
        return <div className="p-6 text-center">Cargando estudiante...</div>
    }

    if (!studentData) {
        return <div className="p-6 text-center text-red-500">No se encontró el estudiante</div>
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
            >
                <div className="p-1.5 rounded-lg bg-white shadow-sm group-hover:bg-gray-50 transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Volver</span>
                </div>
            </button>

            {/* Header del perfil */}
            <Card className="mb-8">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                        Expediente del Estudiante
                    </CardTitle>

                    <EditStudentModal
                        student={studentData}
                        fetchStudent={fetchEstudianteById}
                    />
                </CardHeader>

                <CardContent className="px-5">
                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        {/* Foto */}
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-32 h-32 border-4 border-green-200">

                                {studentData.profileImage ? (
                                    <AvatarImage
                                        src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${studentData.profileImage}`}
                                        alt={studentData.name}
                                    />
                                ) : null}

                                <AvatarFallback className="text-2xl font-bold bg-green-100 text-green-700">
                                    {`${studentData.name?.[0] ?? ""}${studentData.lastName?.[0] ?? ""}`}
                                </AvatarFallback>

                            </Avatar>

                            <Badge variant="secondary" className="text-sm font-medium">
                                Código: {studentData.studentCode}
                            </Badge>
                        </div>

                        {/* Información */}
                        <div className="flex-1 space-y-6">

                            <div>
                                <h1 className="text-3xl text-start font-bold text-gray-900 mb-2">
                                    {studentData.name} {studentData.lastName}
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-green-600" />
                                    <span>Sexo: {studentData.gender?.gender ?? "Sin especificar"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span>Teléfono del estudiante: {studentData.phone}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    <span>Cédula del tutor: {studentData.tutorIdentityCard}</span>
                                </div>


                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-green-600" />
                                    <span>
                                        Fecha de Nacimiento:{" "}
                                        {studentData.dateBirt.toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-green-600" />
                                    <span>Tutor: {studentData.tutorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span>País: {studentData.pais?.pais ?? "Sin país"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    <span>Cédula: {studentData.identityCard}</span>
                                </div>


                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span>Teléfono del tutor: {studentData.tutorPhoneNumber}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span>Municipio: {studentData.municipio?.municipio ?? "Sin municipio"}</span>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span className="flex-1 text-left break-words">Dirección: {studentData.address}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de registros académicos */}
            <TablaRegistrosEstudiante
                registros={registros}
                onVerCalificaciones={handleVerCalificaciones}
            />

            {/* Notas históricas (incluye notas huérfanas de traslados) */}
            {notasHistoricas.length > 0 && (
                <Card className="mt-6 border-0 shadow-lg">
                    <CardHeader
                        className="pb-4 cursor-pointer select-none"
                        onClick={() => setNotasExpandidas(!notasExpandidas)}
                    >
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-slate-800">
                                <GraduationCap className="w-5 h-5 text-amber-600" />
                                Historial de Calificaciones
                                <Badge variant="outline" className="ml-2 text-xs">
                                    {notasHistoricas.length} registros
                                </Badge>
                            </CardTitle>
                            {notasExpandidas ? (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Todas las calificaciones del estudiante. Las notas marcadas en <span className="text-amber-600 font-medium">ámbar</span> son de materias que ya no están en su grupo actual (quedaron registradas de un grupo anterior).
                        </p>
                    </CardHeader>

                    {notasExpandidas && (
                        <CardContent>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left font-semibold p-3">Año</th>
                                            <th className="text-left font-semibold p-3">Asignatura</th>
                                            <th className="text-left font-semibold p-3">Grupo de origen</th>
                                            <th className="text-center font-semibold p-3">Corte</th>
                                            <th className="text-center font-semibold p-3">Nota</th>
                                            <th className="text-center font-semibold p-3">Cualitativa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notasHistoricas.map((nota: any, idx: number) => (
                                            <tr
                                                key={nota.id ?? idx}
                                                className={`border-t border-border hover:bg-muted/30 transition-colors ${nota.esHuerfana ? 'bg-amber-50' : ''}`}
                                            >
                                                <td className="p-3">
                                                    {nota.esquelaHead?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? "—"}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    <span className={nota.esHuerfana ? 'text-amber-700' : ''}>
                                                        {nota.asignatura?.asignatura ?? "—"}
                                                    </span>
                                                    {nota.esHuerfana && (
                                                        <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                                            Trasladada
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="p-3 text-sm text-gray-500">
                                                    {nota.grupoOrigenNombre ?? "—"}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {nota.corte?.corte ?? nota.corte?.abreviatura ?? "—"}
                                                </td>
                                                <td className="p-3 text-center font-semibold">
                                                    {nota.notaCuantitativa ?? "—"}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Badge variant="outline" className="bg-secondary/50">
                                                        {nota.notaCualitativa?.abreviatura ?? nota.notaCualitativa ?? "—"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

        </div>
    )
}