"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Settings, Eye, GraduationCap, CalendarDays } from "lucide-react"
import { getAniosLectivos } from "@/actions/catalogos/anioLectivoMethods"
import { AnioLectivo } from "@/interfaces"
import { useRouter } from "next/navigation"
import AddAniosLectivosModal from "../modals/catalogo/anioLectivoModals/AddAnioLectivoModal"
import SearchBar from "../SearchBar"
import AddOganizacionEscolarConAnioLectivoModal from "../modals/organizacionEscolar/organizacion/AddOganizacionEscolarConAnioLectivoModal"

export function AcademicYearsDashboard() {
    const [anioLectivos, setAniosLectivos] = useState<AnioLectivo[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 3
    const router = useRouter();


    const fetchAniosLectivos = async () => {
        try {
            const response = await getAniosLectivos();
            setAniosLectivos(response);
        } catch (error: unknown) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAniosLectivos();
    }, []);


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

    //filtro
    const filteredAnioLectivo = anioLectivos.filter((u) =>
        u.anio_lectivo.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    //paginacion
    const totalPages = Math.ceil(filteredAnioLectivo.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredAnioLectivo.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-6 ">
            {/* Encabezado y buscador */}
            <div className="flex justify-between items-center text-left">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Años Lectivos</h2>
                    <p className="text-slate-600 mt-1 text-sm">
                        Agrega un nuevo año lectivo, crea la organizacion escolar, forma los grupos <br />correspondientes, asigna materias y agrega los estudiantes.
                    </p>
                </div>
                <SearchBar
                    value={searchTerm}
                    onChange={(val) => {
                        setSearchTerm(val)
                        setCurrentPage(1) // reset página al buscar
                    }}
                    onClear={() => {
                        setSearchTerm("")
                        setCurrentPage(1)
                    }}
                    placeholder="Buscar año lectivo"
                />
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
                    {paginatedData.map((anioLectivo) => (
                        <Card key={anioLectivo.id} className="hover:shadow-lg transition-all duration-200 border-slate-200 bg-white">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                                            <Calendar className="h-5 w-5" />
                                            Año Lectivo {anioLectivo.anio_lectivo}
                                        </CardTitle>
                                        <CardDescription className="text-slate-500">
                                            Creado el {anioLectivo.created_at ? new Date(anioLectivo.created_at).toLocaleDateString() : 'Sin fecha de creación'}
                                        </CardDescription>
                                    </div>
                                    <Badge className={getStatusColor(anioLectivo.isActive)}>{getStatusText(anioLectivo.isActive)}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {anioLectivo.periodos?.length ? (
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                        {anioLectivo.periodos
                                            .slice()
                                            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                                            .map((periodo) => {
                                                const cortes = periodo.cortes.map((corte) => corte.abreviatura || corte.corte).join(", ")
                                                return `${periodo.nombre}: ${cortes || "Sin cortes"}`
                                            })
                                            .join(" | ")}
                                    </div>
                                ) : null}

                                {anioLectivo.organizacionEscolar.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {anioLectivo.organizacionEscolar.map((org) => (
                                            <Card key={org.id} className="border-2 border-dashed border-gray-300 bg-gray-50 hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-slate-700">{org.turno?.turno || "Sin modalidad"}</CardTitle>
                                                    <CardDescription className="text-xs text-slate-500">{org.turno?.modalidad?.modalidad || "Sin modalidad"}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="flex flex-col gap-1 mt-2">
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 text-xs h-7 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                                                onClick={() => router.push(`/add-groups-to-organization/${org.id}`)}
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Ver
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 text-xs h-7 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                                                onClick={() => router.push(`/organizacion?organizacionId=${org.id}`)}
                                                            >
                                                                <Settings className="h-3 w-3 mr-1" />
                                                                Gestionar
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full text-xs h-7 border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                                                            onClick={() => router.push(
                                                                `/catalogo/anioLectivo/calendarizacion?idAnioLectivo=${anioLectivo.id}&modalidadId=${org.turno?.modalidad?.id ?? 0}`
                                                            )}
                                                        >
                                                            <CalendarDays className="h-3 w-3 mr-1" />
                                                            Calendarización
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

                                        <AddOganizacionEscolarConAnioLectivoModal
                                            idAnioLectivo={Number(anioLectivo.id)}
                                            onSuccess={fetchAniosLectivos}
                                        />

                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t border-slate-200">
                                    <AddOganizacionEscolarConAnioLectivoModal
                                        idAnioLectivo={Number(anioLectivo.id)}
                                        onSuccess={fetchAniosLectivos}
                                    />
                                    <Button
                                        onClick={() => router.push(`/catalogo/anioLectivo?idAnioLectivo=${anioLectivo.id}`)}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Gestionar Año
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm text-slate-600">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}