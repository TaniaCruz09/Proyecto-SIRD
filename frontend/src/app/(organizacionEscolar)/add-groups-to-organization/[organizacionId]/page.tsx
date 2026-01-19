"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, Users, GraduationCap, BookOpen, Save, UserCheck, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type {
    OrganizacionEscolar,
} from "@/interfaces"
import GrupoTableForm from "@/components/forms/organizacionEscolarForms/GrupoTableForm"
import { getOrganizacionEscolarById } from "@/actions/organizacionEscolarMethods/organizacionMethods"

export default function OrganizationGroups() {
    const { organizacionId } = useParams();
    const router = useRouter()
    const [organizacionEscolar, setOrganizacionEscolar] = useState<OrganizacionEscolar>()

    const fetchOrganizacionEscolarById = async () => {
        try {
            const response = await getOrganizacionEscolarById(Number(organizacionId))
            console.log("esta es la organizcion", response)
            setOrganizacionEscolar(response)
        } catch (error: unknown) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchOrganizacionEscolarById()
    }, [])

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/home`}
                    >
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6 text-emerald-600" />
                            Grupos - {organizacionEscolar?.turno?.modalidad?.modalidad ?? "N/A"}
                        </h1>
                        <p className="text-slate-600 font-bold">
                            Turno: {organizacionEscolar?.turno?.turno ?? "N/A"} • Año Lectivo {organizacionEscolar?.anio_lectivo?.anio_lectivo ?? "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Formulario para agregar grupos */}
            <GrupoTableForm idOrganizacion={Number(organizacionId)} idTurno={Number(organizacionEscolar?.turno?.id ?? null)} onSuccess={fetchOrganizacionEscolarById} />


            {/* Lista de grupos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Users className="h-5 w-5" />
                        Grupos Configurados ({organizacionEscolar?.grupos?.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {organizacionEscolar?.grupos?.length === 0 ? (
                        <div className="text-center py-12">
                            <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 mb-2">No hay grupos configurados</h3>
                            <p className="text-slate-500">Agrega el primer grupo para esta organización escolar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {organizacionEscolar?.grupos?.map((g) => (
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
                                                {g.docenteGuia ? (
                                                    <span className="font-medium text-slate-800">
                                                        {`${g.docenteGuia.nombres} ${g.docenteGuia.apellido_paterno}`}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 italic">No asignado</span>
                                                )}
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Estudiantes:</span>
                                                {/* <span className="font-medium text-slate-800">{group.estudiantesActuales || 0}</span> */}
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            <Button
                                                variant="outline" size="sm"
                                                className="w-full justify-between bg-transparent"
                                                onClick={() => router.push(`/add-clases-organizacion-escolar/${g.id}`)}
                                            >

                                                <span className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    Materias
                                                </span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="outline" size="sm"
                                                className="w-full justify-between bg-transparent"
                                                onClick={() => router.push(`/add-students-to-group/${g.id}`)}
                                            >

                                                <span className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Estudiantes
                                                </span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
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

