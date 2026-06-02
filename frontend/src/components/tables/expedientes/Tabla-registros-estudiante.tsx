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
import { Eye, BookOpen, History } from "lucide-react"



export interface RegistroAcademico {
    id: string
    grado: string
    modalidad: string
    grupo: string
    docenteGuia: string
    anioLectivo: string
    activo: boolean
}

interface TablaRegistrosEstudianteProps {
    registros: RegistroAcademico[]
    onVerCalificaciones: (registroId: string) => void
}

export function TablaRegistrosEstudiante({ registros, onVerCalificaciones }: TablaRegistrosEstudianteProps) {
    const [activeTab, setActiveTab] = useState<"actual" | "matricula">("actual")

    const registrosActuales = registros.filter(r => r.activo)
    const registrosHistoricos = registros.filter(r => !r.activo)

    const displayedRecords = activeTab === "actual" ? registrosActuales : registrosHistoricos

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2 text-slate-800">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        Historial Académico
                    </CardTitle>

                    {/* Tabs de navegación */}
                    <div className="flex bg-secondary rounded-lg p-1 gap-1">
                        <Button
                            variant={activeTab === "actual" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveTab("actual")}
                            className="gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
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
                                <TableHead className="font-semibold">Docente Guía</TableHead>
                                <TableHead className="font-semibold">Año Lectivo</TableHead>
                                <TableHead className="text-right font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No hay registros {activeTab === "actual" ? "activos" : "históricos"} disponibles
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedRecords.map((registro) => (
                                    <TableRow key={registro.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">{registro.grado}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-secondary/50">
                                                {registro.modalidad}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{registro.grupo}</TableCell>
                                        <TableCell>{registro.docenteGuia}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {registro.anioLectivo}
                                                {registro.activo && (
                                                    <Badge className="bg-accent text-accent-foreground text-xs">
                                                        Activo
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onVerCalificaciones(registro.id)}
                                                className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver Calificaciones
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
                        Mostrando {displayedRecords.length} registro{displayedRecords.length !== 1 ? "s" : ""}
                    </span>
                    {activeTab === "actual" && registrosActuales.length > 0 && (
                        <span className="text-primary font-medium">
                            Año lectivo actual: {registrosActuales[0].anioLectivo}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
