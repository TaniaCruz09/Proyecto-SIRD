"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Users, BookOpen, CheckCircle, AlertCircle, User, UserCircle, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Estudiante {
    id: string
    codigo: string
    nombre: string
    apellido: string
    sexo: "M" | "F"
    foto?: string
    calificaciones: {
        [asignatura: string]: {
            corte1?: string
            corte2?: string
            corte3?: string
            corte4?: string
        }
    }
}

interface Asignatura {
    id: string
    nombre: string
    codigo: string
}

interface AgregarCalificacionesProps {
    grupoId: string
    grupoNombre: string
    anioId: string
    onVolver: () => void
}

// Datos de ejemplo
const asignaturasEjemplo: Asignatura[] = [
    { id: "mat", nombre: "Matemáticas", codigo: "MAT" },
    { id: "esp", nombre: "Español", codigo: "ESP" },
    { id: "cie", nombre: "Ciencias Naturales", codigo: "CIE" },
]

const estudiantesEjemplo: Estudiante[] = [
    {
        id: "est-001",
        codigo: "2024-001",
        nombre: "María",
        apellido: "González Pérez",
        sexo: "F",
        foto: "/estudiante-femenino.jpg",
        calificaciones: {},
    },
    {
        id: "est-002",
        codigo: "2024-002",
        nombre: "Juan",
        apellido: "Martínez López",
        sexo: "M",
        foto: "/estudiante-masculino.jpg",
        calificaciones: {},
    },
    {
        id: "est-003",
        codigo: "2024-003",
        nombre: "Ana",
        apellido: "Rodríguez Silva",
        sexo: "F",
        foto: "/estudiante-femenino-2.jpg",
        calificaciones: {},
    },
    {
        id: "est-004",
        codigo: "2024-004",
        nombre: "Carlos",
        apellido: "Hernández Ruiz",
        sexo: "M",
        foto: "/estudiante-masculino-2.jpg",
        calificaciones: {},
    },
    {
        id: "est-005",
        codigo: "2024-005",
        nombre: "Sofía",
        apellido: "Díaz Morales",
        sexo: "F",
        foto: "/estudiante-femenino-3.jpg",
        calificaciones: {},
    },
    {
        id: "est-006",
        codigo: "2024-006",
        nombre: "Luis",
        apellido: "Torres Ramírez",
        sexo: "M",
        foto: "/estudiante-masculino-3.jpg",
        calificaciones: {},
    },
]

export default function AgregarCalificaciones({ grupoId, grupoNombre, anioId, onVolver }: AgregarCalificacionesProps) {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>(estudiantesEjemplo)
    const [asignaturaActiva, setAsignaturaActiva] = useState(asignaturasEjemplo[0].id)
    const [corteActivo, setCorteActivo] = useState<"corte1" | "corte2" | "corte3" | "corte4">("corte1")
    const [guardando, setGuardando] = useState(false)

    const verificarCorteCompleto = (corte: "corte1" | "corte2" | "corte3" | "corte4", asignaturaId: string) => {
        return estudiantes.every((est) => {
            const calificacion = est.calificaciones[asignaturaId]?.[corte]
            return calificacion && calificacion !== ""
        })
    }

    const verificarCorteHabilitado = (corte: "corte1" | "corte2" | "corte3" | "corte4", asignaturaId: string) => {
        if (corte === "corte1") return true
        if (corte === "corte2") return verificarCorteCompleto("corte1", asignaturaId)
        if (corte === "corte3") return verificarCorteCompleto("corte2", asignaturaId)
        if (corte === "corte4") return verificarCorteCompleto("corte3", asignaturaId)
        return false
    }

    const handleCalificacionChange = (estudianteId: string, asignaturaId: string, corte: string, valor: string) => {
        // Validar que solo sean números entre 0 y 100
        if (valor !== "" && (isNaN(Number(valor)) || Number(valor) < 0 || Number(valor) > 100)) {
            return
        }

        setEstudiantes((prev) =>
            prev.map((est) =>
                est.id === estudianteId
                    ? {
                        ...est,
                        calificaciones: {
                            ...est.calificaciones,
                            [asignaturaId]: {
                                ...est.calificaciones[asignaturaId],
                                [corte]: valor,
                            },
                        },
                    }
                    : est,
            ),
        )
    }

    const handleGuardar = async () => {
        setGuardando(true)
        console.log("[v0] Guardando calificaciones:", { grupoId, anioId, corteActivo, estudiantes })

        // Simular guardado
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setGuardando(false)
        alert(`Calificaciones del ${corteActivo.replace("corte", "Corte ")} guardadas exitosamente`)
    }

    const calcularEstadisticas = (asignaturaId: string, corte: string) => {
        const calificaciones = estudiantes
            .map((est) => est.calificaciones[asignaturaId]?.[corte as keyof (typeof est.calificaciones)[string]])
            .filter((cal) => cal && cal !== "")
            .map(Number)

        const completadas = calificaciones.length
        const pendientes = estudiantes.length - completadas
        const promedio = completadas > 0 ? (calificaciones.reduce((a, b) => a + b, 0) / completadas).toFixed(1) : "N/A"

        return { completadas, pendientes, promedio }
    }

    const estadisticas = calcularEstadisticas(asignaturaActiva, corteActivo)

    const cortesInfo = [
        { id: "corte1", nombre: "Primer Corte", color: "bg-blue-500" },
        { id: "corte2", nombre: "Segundo Corte", color: "bg-green-500" },
        { id: "corte3", nombre: "Tercer Corte", color: "bg-yellow-500" },
        { id: "corte4", nombre: "Cuarto Corte", color: "bg-purple-500" },
    ]

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header con botón de volver */}
            <div className="mb-8">
                <Button variant="ghost" onClick={onVolver} className="mb-4 -ml-2 hover:bg-muted">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Grupos Asignados
                </Button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Agregar Calificaciones</h1>
                        <p className="text-muted-foreground text-lg">
                            Grupo {grupoNombre} - Año Escolar {anioId}
                        </p>
                    </div>
                </div>
            </div>

            <Card className="mb-6 border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-xl">Seleccionar Período de Calificación</CardTitle>
                    <CardDescription>
                        Los cortes se habilitan progresivamente al completar todas las calificaciones del corte anterior
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cortesInfo.map((corte) => {
                            const habilitado = verificarCorteHabilitado(corte.id as any, asignaturaActiva)
                            const completo = verificarCorteCompleto(corte.id as any, asignaturaActiva)

                            return (
                                <Button
                                    key={corte.id}
                                    variant={corteActivo === corte.id ? "default" : "outline"}
                                    disabled={!habilitado}
                                    onClick={() => setCorteActivo(corte.id as any)}
                                    className={`h-auto py-4 flex flex-col items-start gap-2 relative ${corteActivo === corte.id ? "ring-2 ring-primary ring-offset-2" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <div className={`w-3 h-3 rounded-full ${habilitado ? corte.color : "bg-muted"}`} />
                                        <span className="font-semibold">{corte.nombre}</span>
                                        {!habilitado && <Lock className="h-4 w-4 ml-auto" />}
                                        {completo && <CheckCircle className="h-4 w-4 ml-auto text-secondary" />}
                                    </div>
                                    <span className="text-xs opacity-80">
                                        {!habilitado ? "Bloqueado" : completo ? "Completado" : "En progreso"}
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Tabs para asignaturas */}
            <Tabs value={asignaturaActiva} onValueChange={setAsignaturaActiva} className="mb-6">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                    {asignaturasEjemplo.map((asignatura) => {
                        const stats = calcularEstadisticas(asignatura.id, corteActivo)
                        return (
                            <TabsTrigger
                                key={asignatura.id}
                                value={asignatura.id}
                                className="flex flex-col items-start gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                <span className="font-semibold">{asignatura.nombre}</span>
                                <span className="text-xs opacity-80">
                                    {stats.completadas}/{estudiantes.length} completadas
                                </span>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                {asignaturasEjemplo.map((asignatura) => (
                    <TabsContent key={asignatura.id} value={asignatura.id} className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {asignatura.nombre} - {cortesInfo.find((c) => c.id === corteActivo)?.nombre}
                                        </CardTitle>
                                        <CardDescription className="text-base mt-1">
                                            Ingresa las calificaciones de cada estudiante (0-100)
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-base px-4 py-2">
                                        {asignatura.codigo}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Header de la tabla */}
                                    <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 border-b font-semibold text-sm text-muted-foreground">
                                        <div className="col-span-1 text-center">Foto</div>
                                        <div className="col-span-2">Código</div>
                                        <div className="col-span-4">Nombre Completo</div>
                                        <div className="col-span-1 text-center">Sexo</div>
                                        <div className="col-span-4">Calificación</div>
                                    </div>

                                    {/* Lista de estudiantes */}
                                    {estudiantes.map((estudiante) => (
                                        <Card key={estudiante.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                                    {/* Foto */}
                                                    <div className="col-span-1 flex justify-center">
                                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                                            <AvatarImage src={estudiante.foto || "/placeholder.svg"} alt={estudiante.nombre} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                                {estudiante.nombre[0]}
                                                                {estudiante.apellido[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>

                                                    {/* Código */}
                                                    <div className="col-span-2">
                                                        <Label className="text-xs text-muted-foreground md:hidden">Código</Label>
                                                        <p className="font-mono font-semibold text-foreground">{estudiante.codigo}</p>
                                                    </div>

                                                    {/* Nombre completo */}
                                                    <div className="col-span-4">
                                                        <Label className="text-xs text-muted-foreground md:hidden">Nombre</Label>
                                                        <p className="font-semibold text-foreground">
                                                            {estudiante.nombre} {estudiante.apellido}
                                                        </p>
                                                    </div>

                                                    {/* Sexo */}
                                                    <div className="col-span-1 flex justify-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                estudiante.sexo === "M"
                                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                    : "bg-pink-50 text-pink-700 border-pink-200"
                                                            }
                                                        >
                                                            {estudiante.sexo === "M" ? (
                                                                <>
                                                                    <User className="h-3 w-3 mr-1" />M
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCircle className="h-3 w-3 mr-1" />F
                                                                </>
                                                            )}
                                                        </Badge>
                                                    </div>

                                                    {/* Input de calificación */}
                                                    <div className="col-span-4">
                                                        <Label
                                                            htmlFor={`cal-${estudiante.id}-${asignatura.id}-${corteActivo}`}
                                                            className="text-xs text-muted-foreground md:hidden"
                                                        >
                                                            Calificación
                                                        </Label>
                                                        <div className="flex gap-2 items-center">
                                                            <Input
                                                                id={`cal-${estudiante.id}-${asignatura.id}-${corteActivo}`}
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                placeholder="0-100"
                                                                value={estudiante.calificaciones[asignatura.id]?.[corteActivo] || ""}
                                                                onChange={(e) =>
                                                                    handleCalificacionChange(estudiante.id, asignatura.id, corteActivo, e.target.value)
                                                                }
                                                                className="text-center text-lg font-semibold h-12 border-2 focus:border-primary"
                                                            />
                                                            {estudiante.calificaciones[asignatura.id]?.[corteActivo] && (
                                                                <Badge
                                                                    variant={
                                                                        Number(estudiante.calificaciones[asignatura.id]?.[corteActivo]) >= 70
                                                                            ? "default"
                                                                            : "destructive"
                                                                    }
                                                                    className="whitespace-nowrap"
                                                                >
                                                                    {Number(estudiante.calificaciones[asignatura.id]?.[corteActivo]) >= 70
                                                                        ? "Aprobado"
                                                                        : "Reprobado"}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end sticky bottom-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
                <Button variant="outline" onClick={onVolver} size="lg" className="sm:w-auto w-full bg-transparent">
                    Cancelar
                </Button>
                <Button
                    onClick={handleGuardar}
                    disabled={guardando}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto w-full"
                >
                    {guardando ? (
                        <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar {cortesInfo.find((c) => c.id === corteActivo)?.nombre}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
