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
} from "lucide-react"
import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import EditStudentModal from "@/components/modals/Estudiantes/EditStudentModal"
import { useParams } from "next/navigation"
import { TablaRegistrosEstudiante } from "@/components/tables/expedientes/Tabla-registros-estudiante"
import { getEsquelaByGrupo } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods";

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
                        modalidad: grupo.turno?.modalidad?.modalidad ?? grupo.modalidad ?? "Sin modalidad",
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
            console.log(registrosAcademicos)

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

        </div>
    )
}