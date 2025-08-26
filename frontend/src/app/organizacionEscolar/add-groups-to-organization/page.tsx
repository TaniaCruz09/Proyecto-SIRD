"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2, Users, GraduationCap, BookOpen, Save, UserCheck, ChevronRight, Calculator, Badge } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type {
    GrupoEscolar,
} from "@/interfaces"
import GrupoTableForm from "@/components/forms/organizacionEscolarForms/GrupoTableForm"
import { getGrupos } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods"
import { getOrganizacionEscolarById } from "@/actions/organizacionEscolarMethods/organizacionMethods"

// interface Organization {
//     cortes: string[]
// }

export default function OrganizationGroups() {
    const { toast } = useToast()

    // const [organization] = useState<Organization>({
    //     cortes: ["1er Corte", "2do Corte", "3er Corte", "4to Corte"],
    // })

    const searchParams = useSearchParams()

    const idAnioLectivo = searchParams.get("idAnioLectivo")
    const idOrganizacion = searchParams.get("idOrganizacion")
    const anioLectivo = searchParams.get("anioLectivo")
    const modalidad = searchParams.get("modalidad")
    const turnoParam = searchParams.get("turno")
    const idTurno = searchParams.get("idTurno")

    const [groups, setGroups] = useState<GrupoEscolar[]>([])

    const [gruposPorOrganizacionData, setGruposPorOrganizacionData] = useState<GrupoEscolar[]>([])

    useEffect(() => {
        fetchGrupos()
        fetchGruposPorOrganizacion()
    }, [])

    // const addGroup = async () => {
    //     if (!newGroup.grado || !newGroup.seccion || !newGroup.docenteGuia) {
    //         toast({
    //             title: "Error",
    //             description: "Por favor completa todos los campos requeridos",
    //             variant: "destructive",
    //         })
    //         return
    //     }



    // const removeGroup = async (groupId: number) => {
    //     try {
    //         // Here you would call your delete API
    //         // await deleteGrupo(groupId)

    //         // For now, just remove from local state
    //         setGroups(groups.filter((group) => group.id !== groupId))

    //         toast({
    //             title: "Éxito",
    //             description: "Grupo eliminado correctamente",
    //         })
    //     } catch (error) {
    //         console.error("Error al eliminar grupo:", error)
    //         toast({
    //             title: "Error",
    //             description: "No se pudo eliminar el grupo",
    //             variant: "destructive",
    //         })
    //     }
    // }

    const fetchGrupos = async () => {
        try {
            const response = await getGrupos()
            setGroups(response)
        } catch (error) {
            console.error("Error al cargar grupos:", error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los grupos",
                variant: "destructive",
            })
        }
    }

    const fetchGruposPorOrganizacion = async () => {
        try {
            const response = await getOrganizacionEscolarById(Number(idOrganizacion));
            console.log("response ===>", response);
            console.log(response.grupos)
            setGruposPorOrganizacionData(response.grupos || []);
        } catch (error: any) {
            console.error(error);
        }
    };

    //   const totalCapacidad = groups.reduce((sum, group) => {
    //     const capacidad = group.capacidadMaxima || 0
    //     return sum + capacidad
    //   }, 0)

    //   const totalEstudiantes = groups.reduce((sum, group) => {
    //     const estudiantes = group.estudiantesActuales || 0
    //     return sum + estudiantes
    //   }, 0)

    // const totalEstudiantes = groups.reduce((sum, group) => sum + group.estudiantesActuales, 0)

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/organizacionEscolar/add-organizations-to-year?idAnioLectivo=${idAnioLectivo}&anioLectivo=${anioLectivo}`}
                    >
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6 text-emerald-600" />
                            Grupos - {modalidad}
                        </h1>
                        <p className="text-slate-600 font-bold">
                            Turno: {turnoParam} • Año Lectivo {anioLectivo}
                        </p>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">Total Grupos</p>
                                <p className="text-2xl font-bold text-emerald-900">{gruposPorOrganizacionData.length}</p>
                            </div>
                            <GraduationCap className="h-8 w-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Capacidad Total</p>
                                <p className="text-2xl font-bold text-blue-900">total capacidad</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-violet-700">Estudiantes</p>
                                <p className="text-2xl font-bold text-violet-900">total estudiantes</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-violet-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-rose-700">Cortes Activos</p>
                                <p className="text-2xl font-bold text-rose-900">cortes</p>
                            </div>
                            <Save className="h-8 w-8 text-rose-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Formulario para agregar grupos */}
            <GrupoTableForm idOrganizacion={Number(idOrganizacion)} idTurno={Number(idTurno)} onSuccess={fetchGruposPorOrganizacion} />


            {/* Lista de grupos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Users className="h-5 w-5" />
                        Grupos Configurados ({gruposPorOrganizacionData.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {gruposPorOrganizacionData.length === 0 ? (
                        <div className="text-center py-12">
                            <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 mb-2">No hay grupos configurados</h3>
                            <p className="text-slate-500">Agrega el primer grupo para esta organización escolar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.isArray(gruposPorOrganizacionData) && gruposPorOrganizacionData.map((g) => (
                                <Card key={g.id} className="bg-slate-50 border-slate-200 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-slate-800">
                                                {(g.grado?.grades)} - {g.seccion?.seccion ?? "N/A"} - {(g.turno?.turno ?? "N/A")}
                                            </h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                // onClick={() => removeGroup(g.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <UserCheck className="h-4 w-4 text-blue-600" />
                                                <span className="text-slate-600">Docente Guía:</span>
                                                <span className="font-medium text-slate-800">
                                                    {(g.docenteGuia?.nombres)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Estudiantes:</span>
                                                {/* <span className="font-medium text-slate-800">{group.estudiantesActuales || 0}</span> */}
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            {/* <Link
                        href={`/academic-year/${params.year}/organizations/${params.orgId}/groups/${groups?.id}/subjects`}
                      >
                        <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Materias 
                            {/* ({groups?.materiasCount}) */}
                                            {/* {groups?.materiasGuardadas && (
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs">Guardadas</Badge>
                            )} */}
                                            {/* </span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link> */}

                                            <Link
                                                href={`/organizacionEscolar/add-students-to-group?idGrupo=${g.id}&anioLectivo=${anioLectivo}&idAnioLectivo=${idAnioLectivo}&grupo=${`${g.grado.grades} - ${g.seccion.seccion} - ${g.turno.turno}`}&docenteGuia=${g.docenteGuia.nombres}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full justify-between bg-transparent"
                                                //   disabled={!group.materiasGuardadas} // solo habilitado si las materias están guardadas
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        Estudiantes 20
                                                    </span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            {/* <Link
                                                href={`/academic-year/${params.year}/organizations/${params.orgId}/groups/${groups.id}/grades`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full justify-between bg-transparent"
                                                    disabled={!group.materiasGuardadas || group.estudiantesActuales === 0}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Calculator className="h-4 w-4" />
                                                        Calificaciones
                                                    </span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </Link> */}

                                            {/* {!group.materiasGuardadas && (
                                                <p className="text-xs text-amber-600 text-center">
                                                    {group.materiasCount === 0
                                                        ? "Agrega y guarda materias antes de inscribir estudiantes"
                                                        : "Guarda las materias antes de inscribir estudiantes"}
                                                </p>
                                            )} */}

                                            {/* {group.materiasGuardadas && group.estudiantesActuales === 0 && (
                                                <p className="text-xs text-amber-600 text-center">
                                                    Inscribe estudiantes antes de asignar calificaciones
                                                </p>
                                            )} */}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

