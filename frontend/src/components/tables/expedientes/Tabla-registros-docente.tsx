"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, History } from "lucide-react"

export interface AsignacionDocente {
    id: string
    grado: string
    modalidad: string
    materia: string
    anioLectivo: string
    activo: boolean
    cantidadEstudiantes: number
}

interface TablaRegistrosDocenteProps {
    asignaciones: AsignacionDocente[]
    onVerGrupo: (asignacionId: string) => void
}

export function TablaRegistrosDocente({ asignaciones, onVerGrupo }: TablaRegistrosDocenteProps) {
    const [activeTab, setActiveTab] = useState<"actual" | "matricula">("actual")

    const asignacionesActuales = asignaciones.filter(a => a.activo)
    const asignacionesHistoricas = asignaciones.filter(a => !a.activo)

    const displayedRecords = activeTab === "actual" ? asignacionesActuales : asignacionesHistoricas

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Historial de grados guiados
                    </CardTitle>

                    {/* Tabs de navegación */}
                    <div className="flex bg-secondary rounded-lg p-1 gap-1">
                        <Button
                            variant={activeTab === "actual" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveTab("actual")}
                            className="gap-2"
                        >
                            <Briefcase className="w-4 h-4" />
                            <span>Actual</span>
                        </Button>
                        <Button
                            variant={activeTab === "matricula" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveTab("matricula")}
                            className="gap-2"
                        >
                            <History className="w-4 h-4" />
                            <span>Matrícula</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-semibold">Grado</TableHead>
                                <TableHead className="font-semibold">Modalidad</TableHead>
                                <TableHead className="font-semibold">Grupo</TableHead>
                                <TableHead className="font-semibold">Materia</TableHead>
                                <TableHead className="font-semibold">Año Lectivo</TableHead>
                                <TableHead className="font-semibold text-center">Estudiantes</TableHead>
                                <TableHead className="text-right font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No hay asignaciones {activeTab === "actual" ? "activas" : "históricas"} disponibles
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedRecords.map((asignacion) => (
                                    <TableRow key={asignacion.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">{asignacion.grado}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-secondary/50">
                                                {asignacion.modalidad}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{asignacion.id}</TableCell>
                                        <TableCell>{asignacion.materia}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {asignacion.anioLectivo}
                                                {asignacion.activo && (
                                                    <Badge className="bg-accent text-accent-foreground text-xs">
                                                        Activo
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                                {asignacion.cantidadEstudiantes}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onVerGrupo(asignacion.id)}
                                                className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Users className="w-4 h-4" />
                                                Ver Grupo
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Resumen */}
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Mostrando {displayedRecords.length} asignaci{displayedRecords.length !== 1 ? "ones" : "ón"}
                    </span>
                    {activeTab === "actual" && asignacionesActuales.length > 0 && (
                        <span className="text-primary font-medium">
                            Total de estudiantes: {asignacionesActuales.reduce((sum, a) => sum + a.cantidadEstudiantes, 0)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
