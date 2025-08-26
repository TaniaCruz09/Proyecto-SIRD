"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, GraduationCap, Plus, Settings, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { OrganizacionEscolar } from "@/interfaces"
import { getOrganizacionEscolar } from "@/actions/organizacionEscolarMethods/organizacionMethods"
import { getOrganizacionEscolarPorAnio } from "@/actions/catalogos/anioLectivoMethods"
import AddOganizacionEscolarConAnioLectivoModal from "@/components/modals/organizacionEscolar/organizacion/AddOganizacionEscolarConAnioLectivoModal"


export default function AcademicYearOrganizations({ params }: { params: { year: string } }) {
    const [organizacionEscolar, setOrganizacionEscolar] = useState<OrganizacionEscolar[]>([])
    const [organizacionesPorAnioData, setOrganizacionesPorAnioData] = useState<OrganizacionEscolar[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");



    const searchParams = useSearchParams();

    const idAnioLectivo = searchParams.get("idAnioLectivo")
    const anioLectivo = searchParams.get("anioLectivo")
   

    const fetchOrganizacionEscolar = async () => {
        try {
            const response = await getOrganizacionEscolar();
            setOrganizacionEscolar(response);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchOrganizacionPorAniLectivo = async () => {
        try {
            const response = await getOrganizacionEscolarPorAnio(Number(idAnioLectivo));
            console.log("Respuesta de getOrganizacionEscolarPorAnio:", response);
            setOrganizacionesPorAnioData(response.organizacionEscolar || []);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrganizacionEscolar();
        fetchOrganizacionPorAniLectivo()
    }, []);

    // //filtro que busca por el nombre
    // const filteredOrganizacionEscolar = organizacionEscolar.filter((u) =>
    //     u.anio_lectivo.anio_lectivo.toString().toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-left">
                <Link href="/admin/home">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Salir
                    </Button>
                </Link>
                <div className="ml-7">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Calendar className="h-8 w-8" />
                        Año Lectivo {anioLectivo}
                    </h1>
                    <p className="text-muted-foreground">Gestiona las organizaciones escolares de este año lectivo</p>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Organizaciones</p>
                                <p className="text-2xl font-bold">{organizacionesPorAnioData.length}</p>
                            </div>
                            <GraduationCap className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Grupos</p>
                                <p className="text-2xl font-bold">{ }</p>
                                <p></p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cortes por Org.</p>
                                <p className="text-2xl font-bold">4</p>
                            </div>
                            <Settings className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de organizaciones */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Organizaciones Escolares</h2>
                    <AddOganizacionEscolarConAnioLectivoModal
                        idAnioLectivo={Number(idAnioLectivo)}
                        anioLectivo={anioLectivo || " "}
                        fetchOrganizacionPorAnioLectivo={fetchOrganizacionPorAniLectivo} />
                </div>

                {organizacionesPorAnioData.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="p-12 text-center">
                            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay organizaciones creadas</h3>
                            <p className="text-muted-foreground mb-4">
                                Comienza agregando tu primera organización escolar para este año lectivo.
                            </p>
                            <Link href={`/academic-year/${params.year}/create-organization`}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Primera Organización
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {Array.isArray(organizacionesPorAnioData) && organizacionesPorAnioData.map((o) => (
                            <Card key={o.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {o.turno?.modalidad?.modalidad || "Sin modalidad"}
                                                </h3>
                                                <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                                                    {o.turno?.turno || "Sin turno"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                                                {o.cortes && o.cortes.length > 0 ? (
                                                    o.cortes.map((c) => (
                                                        <Badge key={c.id} variant="outline" className="bg-rose-100 text-rose-700">
                                                            {c.corte} - {c.semestre.semestre}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span>Sin cortes</span>
                                                )}
                                                <span>• Grupos: {o.grupos?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Gestionar
                                            </Button>
                                            <Link href={`/organizacionEscolar/add-groups-to-organization?idAnioLectivo=${idAnioLectivo}&idOrganizacion=${o.id}&anioLectivo=${anioLectivo}&modalidad=${o.turno.modalidad?.modalidad}&turno=${o.turno.turno}&idTurno=${o.turno.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-emerald-300 hover:bg-emerald-50 text-emerald-700 bg-transparent"
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Grupos
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
