"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, BookOpen, Users, Settings, Eye, GraduationCap, Link } from "lucide-react"
import { getAniosLectivos } from "@/actions/catalogos/anioLectivoMethods"
import { AnioLectivo, OrganizacionEscolar } from "@/interfaces"
import { useRouter } from "next/navigation"
import AddAniosLectivosModal from "../modals/catalogo/anioLectivoModals/AddAnioLectivoModal"
import { getOrganizacionEscolar } from "@/actions/organizacionEscolarMethods/organizacionMethods"


export function AcademicYearsDashboard() {
    const [anioLectivos, setAniosLectivos] = useState<AnioLectivo[]>([]);
    const router = useRouter();

    const fetchAniosLectivos = async () => {
        try {
            const response = await getAniosLectivos();
            setAniosLectivos(response);
        } catch (error: any) {
            if (error.message === "Unauthorized") {
                router.push("/auth/login"); // redirigir en cliente
            } else {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchAniosLectivos();
    }, []);

    //filtro
    const filteredAnioLectivo = anioLectivos.filter((u) => u.anio_lectivo);

    const getStatusColor = (isActive: boolean) => {
        switch (isActive) {
            case true:
                return "bg-emerald-50 text-emerald-700 border-emerald-200"
            case false:
                return "bg-slate-50 text-slate-600 border-slate-200"
            case null:
                return "bg-amber-50 text-amber-700 border-amber-200"
            default:
                return "bg-slate-50 text-slate-600 border-slate-200"
        }
    }

    const getStatusText = (isActive: boolean) => {
        switch (isActive) {
            case true:
                return "Activo"
            case false:
                return "Inactivo"
            case null:
                return "Borrador"
            default:
                return "Desconocido"
        }
    }

    const totalOrganizations = anioLectivos.reduce((sum, year) => sum + year.organizacionEscolar.length, 0)
    // const totalGroups = anioLectivos.reduce(
    //     (sum, year) => sum + year.organizacionEscolar.reduce((orgSum, org) => orgSum + org.grupo[0], 0),
    //     0,
    // )
    // const totalStudents = anioLectivos.reduce(
    //     (sum, year) => sum + year.organizations.reduce((orgSum, org) => orgSum + org.studentsCount, 0),
    //     0,
    // )

    return (
        <div className="space-y-6 ">
            {/* Header con estadísticas */}
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Resumen Ejecutivo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-500">Años Lectivos</span>
                            <Calendar className="h-3 w-3 text-indigo-400" />
                        </div>
                        <div className="text-lg font-bold text-slate-700">{filteredAnioLectivo.length}</div>
                        <div className="text-xs text-slate-400">
                            {anioLectivos.filter((year) => year.isActive === true).length} activos
                        </div>
                    </div>

                    <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-500">Organizaciones</span>
                            <GraduationCap className="h-3 w-3 text-indigo-400" />
                        </div>
                        <div className="text-lg font-bold text-slate-700">{totalOrganizations}</div>
                        <div className="text-xs text-slate-400">Total registradas</div>
                    </div>

                    <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-500">Profesores</span>
                            <Users className="h-3 w-3 text-indigo-400" />
                        </div>
                        <div className="text-lg font-bold text-slate-700">{ }</div>
                        <div className="text-xs text-slate-400">total docentes</div>
                    </div>

                    <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-500">Estudiantes</span>
                            <Users className="h-3 w-3 text-indigo-400" />
                        </div>
                        <div className="text-lg font-bold text-slate-700">total estudiantes</div>
                        <div className="text-xs text-slate-400">Capacidad total</div>
                    </div>
                </div>
            </div>

            {/* Botón para crear nuevo año lectivo */}
            <div className="flex justify-between items-center text-left">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Años Lectivos</h2>
                    <p className="text-slate-600 mt-1 text-sm">
                        Agrega un nuevo año lectivo, crea la organizacion escolar, forma los grupos correspondientes, asigna materias y agrega estudiantes.
                    </p>
                </div>
                <AddAniosLectivosModal fetchAniosLectivos={fetchAniosLectivos} />
            </div>

            {/* Lista de años lectivos */}
            {anioLectivos.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-slate-700">No hay años lectivos</h3>
                        <p className="text-slate-500 text-center mb-4">Comienza creando tu primer año lectivo</p>
                        <AddAniosLectivosModal fetchAniosLectivos={fetchAniosLectivos} />
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {filteredAnioLectivo.map((year) => (
                        <Card key={year.id} className="hover:shadow-lg transition-all duration-200 border-slate-200 bg-white">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                                            <Calendar className="h-5 w-5" />
                                            Año Lectivo {year.anio_lectivo}
                                        </CardTitle>
                                        <CardDescription className="text-slate-500">
                                            Creado el {new Date(year.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <Badge className={getStatusColor(year.isActive)}>{getStatusText(year.isActive)}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {year.organizacionEscolar.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {year.organizacionEscolar.map((org) => (
                                            <Card key={org.id} className="border-2 border-dashed border-slate-200 bg-slate-50/30">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-slate-700">{org.turno?.turno || "Sin modalidad"}</CardTitle>
                                                    <CardDescription className="text-xs text-slate-500">{org.turno?.modalidad?.modalidad || "Sin modalidad"}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="flex justify-between text-xs text-slate-500">
                                                        <span>{ } grupos</span>
                                                        <span>{ } estudiantes</span>
                                                    </div>
                                                    <div className="flex gap-1 mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs h-7 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            Ver
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs h-7 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                                        >
                                                            <Settings className="h-3 w-3 mr-1" />
                                                            Gestionar
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50">
                                        <GraduationCap className="h-12 w-12 text-slate-400 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2 text-slate-700">Sin organizaciones escolares</h3>
                                        <p className="text-slate-500 text-center mb-4">Este año lectivo no tiene organizaciones aún</p>

                                        <Button onClick={() => router.push(`/organizacionEscolar/add-organizations-to-year?idAnioLectivo=${year.id}&anioLectivo=${year.anio_lectivo}`)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
                                            <Plus className="h-4 w-4" />
                                            Agregar Organización Escolar

                                        </Button>

                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t border-slate-200">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Ver Año Completo
                                    </Button>
                                    <Button
                                        onClick={() => router.push(`/organizacionEscolar/add-organizations-to-year?idAnioLectivo=${year.id}&anioLectivo=${year.anio_lectivo}`)}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Gestionar Año
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Reportes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}