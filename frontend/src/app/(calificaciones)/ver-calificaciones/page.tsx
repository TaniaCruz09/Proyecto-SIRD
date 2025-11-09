"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Users,
    BookOpen,
    TrendingUp,
    TrendingDown,
    Search,
    Download,
    Printer,
    CheckCircle2,
    XCircle,
    Award,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Estudiante {
    id: string
    codigo: string
    nombre: string
    apellido: string
    sexo: "M" | "F"
    foto: string
    calificaciones: {
        [asignatura: string]: {
            corte1?: number | null
            corte2?: number | null
            corte3?: number | null
            corte4?: number | null
            promedio?: number | null
        }
    }
}

interface VerCalificacionesProps {
    grupoId: string
    grupoNombre: string
    anioId: string
    onVolver: () => void
}

const estudiantesData: Estudiante[] = [
    {
        id: "EST001",
        codigo: "2024-001",
        nombre: "María",
        apellido: "González Pérez",
        sexo: "F",
        foto: "/estudiante-femenino.jpg",
        calificaciones: {
            Matemáticas: {
                corte1: 85,
                corte2: 88,
                corte3: 90,
                corte4: 87,
                promedio: 87.5,
            },
            Física: {
                corte1: 78,
                corte2: 82,
                corte3: 85,
                corte4: 80,
                promedio: 81.25,
            },
        },
    },
    {
        id: "EST002",
        codigo: "2024-002",
        nombre: "Carlos",
        apellido: "Rodríguez López",
        sexo: "M",
        foto: "/estudiante-masculino.jpg",
        calificaciones: {
            Matemáticas: {
                corte1: 92,
                corte2: 95,
                corte3: 93,
                corte4: 96,
                promedio: 94,
            },
            Física: {
                corte1: 88,
                corte2: 90,
                corte3: 92,
                corte4: 89,
                promedio: 89.75,
            },
        },
    },
    {
        id: "EST003",
        codigo: "2024-003",
        nombre: "Ana",
        apellido: "Martínez Silva",
        sexo: "F",
        foto: "/estudiante-femenino-2.jpg",
        calificaciones: {
            Matemáticas: {
                corte1: 76,
                corte2: 78,
                corte3: 80,
                corte4: 82,
                promedio: 79,
            },
            Física: {
                corte1: 82,
                corte2: 85,
                corte3: 83,
                corte4: 86,
                promedio: 84,
            },
        },
    },
    {
        id: "EST004",
        codigo: "2024-004",
        nombre: "Luis",
        apellido: "Hernández Castro",
        sexo: "M",
        foto: "/estudiante-masculino-2.jpg",
        calificaciones: {
            Matemáticas: {
                corte1: 68,
                corte2: 72,
                corte3: 75,
                corte4: 70,
                promedio: 71.25,
            },
            Física: {
                corte1: 72,
                corte2: 75,
                corte3: 78,
                corte4: 74,
                promedio: 74.75,
            },
        },
    },
    {
        id: "EST005",
        codigo: "2024-005",
        nombre: "Sofia",
        apellido: "Ramírez Torres",
        sexo: "F",
        foto: "/estudiante-femenino-3.jpg",
        calificaciones: {
            Matemáticas: {
                corte1: 95,
                corte2: 97,
                corte3: 96,
                corte4: 98,
                promedio: 96.5,
            },
            Física: {
                corte1: 91,
                corte2: 93,
                corte3: 95,
                corte4: 92,
                promedio: 92.75,
            },
        },
    },
    {
        id: "EST006",
        codigo: "2024-006",
        nombre: "Diego",
        apellido: "Vargas Morales",
        sexo: "M",
        foto: "/estudiante-masculino-3.jpg",
        calificaciones: {
            Matemáticas: {
                corte1: 58,
                corte2: 62,
                corte3: 65,
                corte4: 68,
                promedio: 63.25,
            },
            Física: {
                corte1: 65,
                corte2: 68,
                corte3: 70,
                corte4: 72,
                promedio: 68.75,
            },
        },
    },
]

const asignaturas = ["Matemáticas", "Física"]

export default function VerCalificaciones({ grupoId, grupoNombre, anioId, onVolver }: VerCalificacionesProps) {
    const [asignaturaActiva, setAsignaturaActiva] = useState(asignaturas[0])
    const [corteActivo, setCorteActivo] = useState<"corte1" | "corte2" | "corte3" | "corte4" | "promedio">("corte1")
    const [searchQuery, setSearchQuery] = useState("")

    // Filtrar estudiantes por búsqueda
    const estudiantesFiltrados = estudiantesData.filter((estudiante) => {
        const query = searchQuery.toLowerCase()
        return (
            estudiante.nombre.toLowerCase().includes(query) ||
            estudiante.apellido.toLowerCase().includes(query) ||
            estudiante.codigo.toLowerCase().includes(query)
        )
    })

    const calcularEstadisticas = (asignatura: string, corte: "corte1" | "corte2" | "corte3" | "corte4" | "promedio") => {
        const calificaciones = estudiantesData
            .map((e) => e.calificaciones[asignatura]?.[corte])
            .filter((c): c is number => c !== null && c !== undefined)

        if (calificaciones.length === 0) {
            return {
                promedio: 0,
                aprobados: 0,
                reprobados: 0,
                sinCalificar: estudiantesData.length,
                notaMasAlta: 0,
                notaMasBaja: 0,
            }
        }

        const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length
        const aprobados = calificaciones.filter((c) => c >= 70).length
        const reprobados = calificaciones.filter((c) => c < 70).length
        const sinCalificar = estudiantesData.length - calificaciones.length

        return {
            promedio: Math.round(promedio * 10) / 10,
            aprobados,
            reprobados,
            sinCalificar,
            notaMasAlta: Math.max(...calificaciones),
            notaMasBaja: Math.min(...calificaciones),
        }
    }

    const estadisticas = calcularEstadisticas(asignaturaActiva, corteActivo)

    const handleExportar = () => {
        alert("Exportando calificaciones a Excel...")
    }

    const handleImprimir = () => {
        window.print()
    }

    const cortesInfo = [
        { id: "corte1", nombre: "Primer Corte", color: "bg-blue-500" },
        { id: "corte2", nombre: "Segundo Corte", color: "bg-green-500" },
        { id: "corte3", nombre: "Tercer Corte", color: "bg-yellow-500" },
        { id: "corte4", nombre: "Cuarto Corte", color: "bg-purple-500" },
        { id: "promedio", nombre: "Promedio Final", color: "bg-primary" },
    ]

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header con botón de volver */}
            <div className="mb-8">
                <Button variant="ghost" onClick={onVolver} className="mb-4 -ml-2 hover:bg-muted">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Grupos
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Ver Calificaciones</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-lg">
                                Grupo {grupoNombre} - {anioId}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleImprimir} className="gap-2 bg-transparent">
                            <Printer className="h-4 w-4" />
                            Imprimir
                        </Button>
                        <Button onClick={handleExportar} className="gap-2 bg-secondary hover:bg-secondary/90">
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="mb-6 border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-xl">Seleccionar Período de Calificación</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {cortesInfo.map((corte) => (
                            <Button
                                key={corte.id}
                                variant={corteActivo === corte.id ? "default" : "outline"}
                                onClick={() => setCorteActivo(corte.id as any)}
                                className={`h-auto py-3 flex flex-col items-center gap-2 ${corteActivo === corte.id ? "ring-2 ring-primary ring-offset-2" : ""
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${corte.color}`} />
                                <span className="font-semibold text-sm text-center">{corte.nombre}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tabs de asignaturas */}
            <Tabs value={asignaturaActiva} onValueChange={setAsignaturaActiva} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1">
                    {asignaturas.map((asignatura) => (
                        <TabsTrigger
                            key={asignatura}
                            value={asignatura}
                            className="text-base py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            {asignatura}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {asignaturas.map((asignatura) => (
                    <TabsContent key={asignatura} value={asignatura} className="mt-6 space-y-6">
                        {/* Estadísticas de la asignatura */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                            <Card className="border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">Promedio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                        <span className="text-2xl font-bold text-foreground">{estadisticas.promedio}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-secondary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">Aprobados</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                                        <span className="text-2xl font-bold text-foreground">{estadisticas.aprobados}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-destructive">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">Reprobados</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-2xl font-bold text-foreground">{estadisticas.reprobados}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-accent">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">Sin Calificar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-accent-foreground" />
                                        <span className="text-2xl font-bold text-foreground">{estadisticas.sinCalificar}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-secondary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">Nota Más Alta</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-secondary" />
                                        <span className="text-2xl font-bold text-foreground">{estadisticas.notaMasAlta}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-destructive">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">Nota Más Baja</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="h-4 w-4 text-destructive" />
                                        <span className="text-2xl font-bold text-foreground">{estadisticas.notaMasBaja}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Barra de búsqueda */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar estudiante por nombre, apellido o código..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base border-2 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-3">
                            {estudiantesFiltrados.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-muted rounded-full">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1">No se encontraron estudiantes</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Intenta con otro término de búsqueda o borra el filtro
                                            </p>
                                        </div>
                                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                                            Limpiar búsqueda
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                estudiantesFiltrados.map((estudiante, index) => {
                                    const calificacion = estudiante.calificaciones[asignatura]?.[corteActivo]
                                    const aprobado = calificacion !== null && calificacion !== undefined && calificacion >= 70

                                    return (
                                        <Card
                                            key={estudiante.id}
                                            className="hover:shadow-md transition-all border-2 hover:border-primary/30"
                                        >
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                    {/* Número de lista */}
                                                    <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-semibold">
                                                        {index + 1}
                                                    </div>

                                                    {/* Avatar y datos del estudiante */}
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <Avatar className="h-14 w-14 border-2 border-primary/20">
                                                            <AvatarImage src={estudiante.foto || "/placeholder.svg"} alt={estudiante.nombre} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                                {estudiante.nombre[0]}
                                                                {estudiante.apellido[0]}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <h3 className="font-semibold text-foreground text-base">
                                                                    {estudiante.nombre} {estudiante.apellido}
                                                                </h3>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        estudiante.sexo === "M"
                                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                            : "bg-pink-50 text-pink-700 border-pink-200"
                                                                    }
                                                                >
                                                                    {estudiante.sexo === "M" ? "Masculino" : "Femenino"}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">Código: {estudiante.codigo}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 lg:ml-auto">
                                                        {corteActivo === "promedio" ? (
                                                            // Mostrar promedio final
                                                            <>
                                                                <div className="text-right">
                                                                    <div className="text-3xl font-bold text-foreground">{calificacion?.toFixed(1)}</div>
                                                                    <div className="text-xs text-muted-foreground">Promedio Final</div>
                                                                </div>
                                                                <Badge
                                                                    className={
                                                                        aprobado
                                                                            ? "bg-secondary text-secondary-foreground"
                                                                            : "bg-destructive text-destructive-foreground"
                                                                    }
                                                                >
                                                                    {aprobado ? (
                                                                        <>
                                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                            Aprobado
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                            Reprobado
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                            </>
                                                        ) : (
                                                            // Mostrar calificación del corte específico
                                                            <>
                                                                <div className="text-right">
                                                                    <div className="text-3xl font-bold text-foreground">{calificacion}</div>
                                                                    <div className="text-xs text-muted-foreground">de 100</div>
                                                                </div>
                                                                {calificacion !== null && calificacion !== undefined ? (
                                                                    <Badge
                                                                        className={
                                                                            aprobado
                                                                                ? "bg-secondary text-secondary-foreground"
                                                                                : "bg-destructive text-destructive-foreground"
                                                                        }
                                                                    >
                                                                        {aprobado ? (
                                                                            <>
                                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                                Aprobado
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                                Reprobado
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                                                                        Sin calificar
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {corteActivo === "promedio" && (
                                                    <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-2">
                                                        {["corte1", "corte2", "corte3", "corte4"].map((corte, idx) => {
                                                            const nota = estudiante.calificaciones[asignatura]?.[
                                                                corte as keyof (typeof estudiante.calificaciones)[string]
                                                            ] as number | null | undefined
                                                            return (
                                                                <div key={corte} className="text-center">
                                                                    <div className="text-xs text-muted-foreground mb-1">Corte {idx + 1}</div>
                                                                    <div className="text-lg font-bold text-foreground">
                                                                        {nota !== null && nota !== undefined ? nota : "-"}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Footer informativo */}
            <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Información de Calificaciones</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Esta vista muestra todas las calificaciones registradas para el grupo {grupoNombre} organizadas por cortes
                            académicos. Las calificaciones iguales o superiores a 70 se consideran aprobadas. El promedio final se
                            calcula automáticamente con base en los cuatro cortes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
