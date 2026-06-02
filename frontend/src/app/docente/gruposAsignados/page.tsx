"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Users, BookOpen, CheckCircle2, XCircle, FileEdit, Eye, GraduationCap, Search } from "lucide-react"
import Calificaciones from "@/app/(calificaciones)/agregar-calificaciones/page"
import { useAuth } from "@/hooks/useAuth"
import { getGradosByDocenteId } from "@/actions/docentesMethods/docentesMethods"
import { getEsquelaByGrupo } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"

interface Grupo {
    id: string
    nombre: string
    materia: string
    numeroEstudiantes: number
    esquelaId?: number
}

interface OrganizacionEscolar {
    id: number
    grupos?: Grupo[]
}

interface AnioEscolar {
    id: string
    anio_lectivo: number
    isActive: boolean
    organizacionEscolar: OrganizacionEscolar[]
}

export default function GruposAsignados() {
    const { docente } = useAuth()
    const [aniosEscolares, setAniosEscolares] = useState<AnioEscolar[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [defaultValue, setDefaultValue] = useState<string | undefined>()
    const [vistaActual, setVistaActual] = useState<"lista" | "agregar" | "ver">("lista")
    const [grupoSeleccionado, setGrupoSeleccionado] = useState<{
        grupoId: string
        grupoNombre: string
        anioId: string
    } | null>(null)

    // 🧩 Cargar datos del backend y asociar esquelaId a cada grupo
    useEffect(() => {
        if (!docente?.id) return

        const fetchData = async () => {
            try {
                const res = await getGradosByDocenteId(docente.id)
                const docentes = res

                if (!docentes?.grupoAsignaturaDocente?.length) {
                    setAniosEscolares([])
                    return
                }

                const gruposPorAnio: Record<string, AnioEscolar> = {}
                const estudiantesPorGrupo = new Map<string, Set<number>>()

                docentes.grupoAsignaturaDocente.forEach((relacion: any) => {
                    const grupo = relacion.grupo
                    const anio = grupo?.organizacionEscolar?.anio_lectivo
                    const grupoKey = grupo?.id?.toString()
                        const estudiantesRelacion = new Set<number>(
                        (relacion?.gruposConEstudiantes || [])
                            .map((item: any) => item?.estudiante?.id)
                            .filter((id: any) => Number.isFinite(Number(id)))
                            .map((id: any) => Number(id))
                    )

                    if (grupoKey) {
                        if (!estudiantesPorGrupo.has(grupoKey)) {
                            estudiantesPorGrupo.set(grupoKey, new Set<number>())
                        }

                        const acumulado = estudiantesPorGrupo.get(grupoKey)!
                        estudiantesRelacion.forEach((id: number) => acumulado.add(id))
                    }

                    if (!anio?.id) {
                        return
                    }

                    const anioId = anio.id.toString()

                    if (!gruposPorAnio[anioId]) {
                        gruposPorAnio[anioId] = {
                            id: anioId,
                            anio_lectivo: anio.anio_lectivo,
                            isActive: anio.isActive,
                            organizacionEscolar: []
                        }
                    }

                    if (!gruposPorAnio[anioId].organizacionEscolar.length) {
                        gruposPorAnio[anioId].organizacionEscolar.push({ id: anio.id, grupos: [] })
                    }

                    const organizacion = gruposPorAnio[anioId].organizacionEscolar[0]
                    const gruposArray = organizacion.grupos!

                    const grupoExistente = gruposArray.find(g => g.id === grupo.id.toString())
                    if (grupoExistente) {
                        if (!grupoExistente.materia.split(', ').includes(relacion.asignatura.asignatura)) {
                            grupoExistente.materia += `, ${relacion.asignatura.asignatura}`
                        }
                        grupoExistente.numeroEstudiantes = estudiantesPorGrupo.get(grupo.id.toString())?.size || 0
                    } else {
                        gruposArray.push({
                            id: grupo.id.toString(),
                            nombre: `${grupo.grado.grades} ${grupo.seccion.seccion}`,
                            materia: relacion.asignatura.asignatura,
                            numeroEstudiantes: estudiantesPorGrupo.get(grupo.id.toString())?.size || 0
                        })
                    }
                })

                const anios = Object.values(gruposPorAnio)

                // Asociar esquelaId a cada grupo
                for (const anio of anios) {
                    const organizacion = anio.organizacionEscolar[0]
                    const gruposOriginal = organizacion?.grupos || []
                    const gruposConEsquela: Grupo[] = []

                    for (const grupo of gruposOriginal) {
                        try {
                            const esquela = await getEsquelaByGrupo(Number(grupo.id))
                            if (esquela) {
                                gruposConEsquela.push({
                                    ...grupo,
                                    esquelaId: esquela.id
                                })
                            }
                        } catch { }
                    }

                    organizacion.grupos = gruposConEsquela
                }

                const aniosFiltrados = anios.filter(a => (a.organizacionEscolar[0]?.grupos?.length || 0) > 0)
                aniosFiltrados.sort((a, b) => b.anio_lectivo - a.anio_lectivo)
                setAniosEscolares(aniosFiltrados)
                setDefaultValue(aniosFiltrados.find(a => a.isActive)?.id || aniosFiltrados[0]?.id)
            } catch (error) {
                console.error("Error cargando docente:", error)
            }
        }

        fetchData()
    }, [docente])

    // 🔍 Filtrar búsqueda
    const aniosFiltrados = aniosEscolares.filter((anio) => {
        const query = searchQuery.toLowerCase()
        return (
            anio.anio_lectivo.toString().includes(query) ||
            anio.id.toString().includes(query)
        )
    })

    // 🧭 Control de vistas
    const handleCalificaciones = (grupo: Grupo, anioId: string) => {
        setGrupoSeleccionado({
            grupoId: grupo.id,
            grupoNombre: grupo.nombre,
            anioId,
        })
        setVistaActual("agregar")
    }

    const handleVerCalificaciones = (grupo: Grupo, anioId: string) => {
        setGrupoSeleccionado({
            grupoId: grupo.id,
            grupoNombre: grupo.nombre,
            anioId,
        })
        setVistaActual("ver")
    }

    const handleVolver = () => {
        setVistaActual("lista")
        setGrupoSeleccionado(null)
    }

    // 🔹 Renderizar vistas de agregar o ver calificaciones
    if ((vistaActual === "agregar" || vistaActual === "ver") && grupoSeleccionado) {
        const grupo = aniosEscolares
            .flatMap(a => a.organizacionEscolar[0]?.grupos || [])
            .find(g => g.id === grupoSeleccionado.grupoId)

        const anio = aniosEscolares.find(a => a.id === grupoSeleccionado.anioId)
        const isAnioActivo = anio?.isActive ?? false

        return (
            <Calificaciones
                esquelaId={grupo?.esquelaId || 0}
                grupoId={Number(grupoSeleccionado.grupoId)}
                grupoNombre={grupoSeleccionado.grupoNombre}
                isAnioActivo={isAnioActivo} // <-- flag para inputs readonly
                onVolver={handleVolver}
            />
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Calificaciones</h1>
                        <p className="text-muted-foreground text-lg">
                            Selecciona el grupo Académico al cual le asignarás las calificaciones
                        </p>
                    </div>
                </div>
            </div>

            {/* Buscador */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar año escolar... (ej: 2024, 2023-2024)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base border-2 focus:border-primary"
                    />
                </div>
                {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-2">
                        {aniosFiltrados.length === 0
                            ? "No se encontraron años escolares"
                            : `Mostrando ${aniosFiltrados.length} ${aniosFiltrados.length === 1 ? "año" : "años"}`}
                    </p>
                )}
            </div>

            {/* Acordeón de años */}
            {aniosFiltrados.length === 0 ? (
                <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-muted rounded-full">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">No se encontraron resultados</h3>
                            <p className="text-sm text-muted-foreground">
                                Intenta con otro término de búsqueda o borra el filtro para ver todos los años
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                            Limpiar búsqueda
                        </Button>
                    </div>
                </Card>
            ) : (
                <Accordion type="single" collapsible defaultValue={defaultValue} className="space-y-4">
                    {aniosFiltrados.map((anio) => (
                        <AccordionItem key={anio.id} value={anio.id} className="border rounded-lg bg-card shadow-sm overflow-hidden">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${anio.isActive ? "bg-primary/10" : "bg-muted"}`}>
                                            <Calendar className={`h-6 w-6 ${anio.isActive ? "text-primary" : "text-muted-foreground"}`} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                                Año Escolar {anio.anio_lectivo}
                                                {anio.isActive ? (
                                                    <Badge className="bg-secondary text-secondary-foreground">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Activo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Finalizado
                                                    </Badge>
                                                )}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="hidden sm:inline">
                                            {(anio.organizacionEscolar[0]?.grupos?.length || 0)} {(anio.organizacionEscolar[0]?.grupos?.length || 0) === 1 ? "grupo" : "grupos"}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-2">
                                {anio.isActive ? (
                                    <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <p className="text-sm text-foreground">
                                            <strong>Año activo:</strong> Puedes agregar y editar calificaciones para estos grupos.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mb-4 p-4 bg-muted border border-border rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Año finalizado:</strong> Solo puedes consultar las calificaciones registradas.
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {anio.organizacionEscolar[0]?.grupos?.map((grupo) => (
                                        <Card key={grupo.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                                            {/* Barra superior */}
                                            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-500" />
                                            <CardContent className="p-6">
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-lg font-bold text-gray-800 truncate">
                                                            {grupo.nombre}
                                                        </CardTitle>
                                                        <CardDescription className="text-sm text-gray-500 mt-0.5 truncate">
                                                            {grupo.materia}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl ml-3 flex-shrink-0">
                                                        <Users className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 mb-5">
                                                    <Users className="w-4 h-4 text-blue-500" />
                                                    <span>
                                                        <strong>{grupo.numeroEstudiantes}</strong>{" "}
                                                        {grupo.numeroEstudiantes === 1 ? "estudiante" : "estudiantes"}
                                                    </span>
                                                </div>

                                                {/* Botón según estado */}
                                                {anio.isActive ? (
                                                    <Button
                                                        className="w-full h-11 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                                                        onClick={() => handleCalificaciones(grupo, anio.id)}
                                                    >
                                                        <FileEdit className="w-4 h-4 mr-2" />
                                                        Agregar Calificaciones
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-11 text-sm font-medium border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
                                                        onClick={() => handleCalificaciones(grupo, anio.id)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Ver Calificaciones
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                        <BookOpen className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Información del Sistema</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            El Sistema de Registro de Calificaciones (SIRD) te permite gestionar las calificaciones de todos tus grupos de manera organizada.
                            Los años activos permiten agregar y editar calificaciones, mientras que los años finalizados solo permiten consulta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
