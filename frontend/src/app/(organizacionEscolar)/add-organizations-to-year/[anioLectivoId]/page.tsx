"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, GraduationCap, Settings, Users } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AnioLectivo } from "@/interfaces"
import AddOganizacionEscolarConAnioLectivoModal from "@/components/modals/organizacionEscolar/organizacion/AddOganizacionEscolarConAnioLectivoModal"
import { getAnioLectivoById } from "@/actions/catalogos/anioLectivoMethods"


export default function AcademicYearOrganizations() {
    const [anioLectivoConOrganizacion, setAnioLectivoConOrganizacion] = useState<AnioLectivo | null>(null);

    const { anioLectivoId } = useParams();

    const fetchOrganizacionPorAnioLectivo = async () => {
        try {
            const response = await getAnioLectivoById(Number(anioLectivoId));
            setAnioLectivoConOrganizacion(response || []);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrganizacionPorAnioLectivo()
    }, []);

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
                        Año Lectivo {anioLectivoConOrganizacion?.anio_lectivo}
                    </h1>
                    <p className="text-muted-foreground">Gestiona las organizaciones escolares de este año lectivo</p>
                </div>
            </div>

            {/* Lista de organizaciones */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Organizaciones Escolares</h2>
                    <AddOganizacionEscolarConAnioLectivoModal
                        idAnioLectivo={Number(anioLectivoId)}
                        fetchOrganizacionPorAnioLectivo={fetchOrganizacionPorAnioLectivo} />
                </div>

                {anioLectivoConOrganizacion?.organizacionEscolar?.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="p-12 text-center">
                            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay organizaciones creadas</h3>
                            <p className="text-muted-foreground mb-4">
                                Comienza agregando tu primera organización escolar para este año lectivo.
                            </p>
                            <AddOganizacionEscolarConAnioLectivoModal
                                idAnioLectivo={Number(anioLectivoId)}
                                fetchOrganizacionPorAnioLectivo={fetchOrganizacionPorAnioLectivo} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {anioLectivoConOrganizacion?.organizacionEscolar.map((o) => (
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
                                                <Badge key={o.corte?.id} variant="outline" className="bg-rose-100 text-rose-700">
                                                    {o.corte?.corte} - {o.corte?.semestre.semestre}
                                                </Badge>
                                                <span>• Grupos: {o.grupos?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Gestionar
                                            </Button>
                                            <Link href={`/add-groups-to-organization/${o.id}`}>
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
