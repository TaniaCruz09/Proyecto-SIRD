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
import { Eye, BookOpen, History, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"



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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <BookOpen className="h-5 w-5" />
                        </span>
                        Historial Académico
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            {registros.length}
                        </span>
                    </CardTitle>

                    {/* Tabs de navegación */}
                    <div className="inline-flex w-fit rounded-lg bg-slate-100 p-1">
                        <button
                            type="button"
                            aria-pressed={activeTab === "actual"}
                            onClick={() => setActiveTab("actual")}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                                activeTab === "actual"
                                    ? "bg-white text-green-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900",
                            )}
                        >
                            <BookOpen className="h-4 w-4" />
                            Actual
                            <span className="rounded-full bg-slate-100 px-1.5 text-xs text-slate-500">
                                {registrosActuales.length}
                            </span>
                        </button>
                        <button
                            type="button"
                            aria-pressed={activeTab === "matricula"}
                            onClick={() => setActiveTab("matricula")}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                                activeTab === "matricula"
                                    ? "bg-white text-green-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900",
                            )}
                        >
                            <History className="h-4 w-4" />
                            Matrícula
                            <span className="rounded-full bg-slate-100 px-1.5 text-xs text-slate-500">
                                {registrosHistoricos.length}
                            </span>
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <Table className="min-w-[560px]">
                        <TableHeader>
                            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Grado</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Modalidad</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Grupo</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Docente guía</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Año lectivo</TableHead>
                                <TableHead className="h-11 px-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedRecords.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="px-3 py-14 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <BookOpen className="h-6 w-6 text-slate-300" />
                                            <p className="text-sm">
                                                No hay registros {activeTab === "actual" ? "activos" : "históricos"} disponibles
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedRecords.map((registro) => (
                                    <TableRow
                                        key={registro.id}
                                        className="border-slate-100 transition-colors hover:bg-green-50/40"
                                    >
                                        <TableCell className="whitespace-normal px-3 py-3 font-medium text-slate-800">
                                            {registro.grado}
                                        </TableCell>
                                        <TableCell className="px-3 py-3">
                                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                                {registro.modalidad}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-3 py-3 font-mono text-xs text-slate-500">
                                            {registro.grupo}
                                        </TableCell>
                                        <TableCell className="whitespace-normal px-3 py-3 text-slate-700">
                                            {registro.docenteGuia}
                                        </TableCell>
                                        <TableCell className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="tabular-nums text-slate-700">{registro.anioLectivo}</span>
                                                {registro.activo && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                                                        Activo
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 py-3 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onVerCalificaciones(registro.id)}
                                                className="gap-2 border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
                                            >
                                                <Eye className="h-4 w-4" />
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
                <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        Mostrando{" "}
                        <span className="font-medium text-slate-700">{displayedRecords.length}</span>{" "}
                        registro{displayedRecords.length !== 1 ? "s" : ""}
                    </span>
                    {activeTab === "actual" && registrosActuales.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
                            <CalendarDays className="h-4 w-4" />
                            Año lectivo actual: {registrosActuales[0].anioLectivo}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
