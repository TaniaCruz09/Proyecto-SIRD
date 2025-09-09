"use client"
import { useEffect, useState } from "react"
import { getEstudentById } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/pogress"
import {
    CalendarDays,
    GraduationCap,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    User,
} from "lucide-react"
import RegisterEstudent, { AcademicYear } from "@/interfaces/registerEstudentInterface"
import EditStudentModal from "@/components/modals/Estudiantes/EditStudentModal"
import { useParams } from "next/navigation"

export default function StudentProfile() {
    const [studentData, setStudentData] = useState<RegisterEstudent | null>(null)
    const [loading, setLoading] = useState(true)

    const { estudianteId } = useParams();

    // Fetch del estudiante
    const fetchEstudianteById = async () => {
        try {
            const student = await getEstudentById(Number(estudianteId))

            // Crear historial académico con estados correctos
            const academicHistory: AcademicYear[] =
                student.grupoAsignaturaConEstudiantes.map((item: any) => {
                    const grupo = item.grupoAsignaturaDocente.grupo
                    const subjects = grupo.grupoAsignaturaDocente.map(
                        (ga: any) => ga.asignatura.asignatura
                    )

                    return {
                        id: item.id,
                        year: grupo.organizacionEscolar.anio_lectivo.anio_lectivo.toString(),
                        grade: grupo.grado.grades,
                        gpa: 80,
                        isActive: "completed", // por defecto
                        subjects,
                        teacher: `${grupo.docenteGuia.nombres} ${grupo.docenteGuia.apellido_paterno}`,
                    }
                })

            // Marcar último año como "current"
            if (academicHistory.length > 0) {
                academicHistory[academicHistory.length - 1].isActive = "current"
            }

            // Combinar con los datos del estudiante
            const studentWithDate: RegisterEstudent = {
                ...student,
                dateBirt: new Date(student.dateBirt),
                academicHistory,
            }

            setStudentData(studentWithDate)
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

    // Calcular progreso
    const completedYears = studentData.academicHistory.filter(
        (year) => year.isActive === "completed"
    )
    const overallProgress =
        (completedYears.length / studentData.academicHistory.length) * 100

    // Filtrar duplicados por año + grado
    const uniqueAcademicHistory = studentData.academicHistory.filter(
        (value, index, self) =>
            index === self.findIndex(
                (t) => t.year === value.year && t.grade === value.grade
            )
    )

    const handleViewGrades = (year: string, grade: string) => {
        console.log(`Ver calificaciones de ${grade} - ${year}`)
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header del Perfil */}
            <Card className="mb-8">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                        Historial Académico
                    </CardTitle>

                    <EditStudentModal student={studentData} fetchStudent={fetchEstudianteById} />
                </CardHeader>
                <CardContent className="px-5">
                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        {/* Foto y código del estudiante */}
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-32 h-32 border-4 border-green-200">
                                {studentData.profileImage ? (
                                    <AvatarImage
                                        src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${studentData.profileImage}` || "/placeholder.svg"}
                                        alt={studentData.name}
                                    />
                                ) : null}
                                <AvatarFallback className="text-2xl font-bold bg-green-100 text-green-700">
                                    {`${studentData.name.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 1)}${studentData.lastName.split("")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 1)}`}
                                </AvatarFallback>
                            </Avatar>
                            <Badge variant="secondary" className="text-sm font-medium">
                                Código: {studentData.studentCode}
                            </Badge>
                        </div>

                        {/* Información del estudiante */}
                        <div className="flex-1 space-y-6">
                            {/* Nombre */}
                            <div>
                                <h1 className="text-3xl text-start font-bold text-gray-900 mb-2">
                                    {studentData.name} {studentData.lastName}
                                </h1>
                                <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                                    <span className="font-medium">Información Personal:</span>
                                </div>
                            </div>

                            {/* Detalles personales */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span>País: {studentData.pais.pais}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span>Municipio: {studentData.municipio.municipio}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    <span>Cédula: {studentData.identityCard}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-green-600" />
                                    <span>Sexo: {studentData.gender.gender}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span>Dirección: {studentData.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-green-600" />
                                    <span>Tutor: {studentData.tutorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    <span>Cédula del tutor: {studentData.tutorIdentityCard}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span>Teléfono del tutor: {studentData.tutorPhoneNumber}</span>
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
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Historial Académico */}
            <Card>
                <CardHeader >
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                        Listado de grados
                    </CardTitle>
                    <div className="flex items-center gap-20 text-sm text-gray-600">
                        <span>
                            Progreso: {completedYears.length} de {studentData.academicHistory.length} años completados
                        </span>
                        <Progress value={overallProgress} className="flex-1 max-w-xs h-2" />
                    </div>
                </CardHeader>
                <CardContent className="px-8">
                    <div className="grid gap-4">
                        {uniqueAcademicHistory.map((year, index) => (
                            <Card
                                key={`${year.id}-${index}`}
                                className={`transition-all duration-200 hover:shadow-md ${year.isActive === "current" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                                    }`}
                            >
                                <CardContent className="px-5">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* Timeline indicator */}
                                        <div className="flex md:flex-col items-center md:items-start gap-2">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${year.isActive === "current" ? "bg-green-600 text-white" : "bg-blue-500 text-white"
                                                    }`}
                                            >
                                                {year.year}
                                            </div>
                                            {index < uniqueAcademicHistory.length - 1 && (
                                                <div className="hidden md:block w-0.5 h-4 bg-gray-300 mt-1" />
                                            )}
                                        </div>

                                        {/* Contenido del año */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-lg text-start font-semibold text-gray-900">{year.grade}</h3>
                                                    <p className="text-xs text-start text-gray-600">Año académico {year.year}</p>
                                                    <p className="text-xs text-start text-gray-600">Docente guía: {year.teacher}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={year.isActive === "current" ? "default" : "secondary"} className="text-xs">
                                                        {year.isActive === "current" ? "Cursando" : "Completado"}
                                                    </Badge>
                                                    <div className="text-right">
                                                        <div className="text-base font-bold text-green-600">{year.gpa}</div>
                                                        <div className="text-xs text-gray-600">Promedio</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Materias */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-start mb-1 text-xs">Materias:</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {year.subjects.map((subject) => (
                                                        <Badge key={subject} variant="outline" className="text-xs py-0.5 px-1.5">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Botón para ver calificaciones */}
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewGrades(year.year, year.grade)}
                                                    className="flex items-center gap-1.5 text-xs h-7"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    Ver Calificaciones
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
