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
import { Users, Briefcase, History } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AsignacionDocente {
    id: string
    grado: string
    modalidad: string
    materia: string
    anioLectivo: string
    activo: boolean
    cantidadEstudiantes: number
    esquela: number
}

interface TablaRegistrosDocenteProps {
    asignaciones: AsignacionDocente[]
    onVerGrupo: (asignacionId: number) => void
}

export function TablaRegistrosDocente({ asignaciones, onVerGrupo }: TablaRegistrosDocenteProps) {
    const [activeTab, setActiveTab] = useState<"actual" | "matricula">("actual")

    const asignacionesActuales = asignaciones.filter(a => a.activo)
    const asignacionesHistoricas = asignaciones.filter(a => !a.activo)

    const displayedRecords = activeTab === "actual" ? asignacionesActuales : asignacionesHistoricas

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <Briefcase className="h-5 w-5" />
                        </span>
                        Historial de grados guiados
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            {asignaciones.length}
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
                            <Briefcase className="h-4 w-4" />
                            Actual
                            <span className="rounded-full bg-slate-100 px-1.5 text-xs text-slate-500">
                                {asignacionesActuales.length}
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
                                {asignacionesHistoricas.length}
                            </span>
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <Table className="min-w-[640px]">
                        <TableHeader>
                            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Grado</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Modalidad</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Grupo</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Materia</TableHead>
                                <TableHead className="h-11 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Año lectivo</TableHead>
                                <TableHead className="h-11 px-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Estudiantes</TableHead>
                                <TableHead className="h-11 px-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedRecords.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={7} className="px-4 py-14 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Users className="h-6 w-6 text-slate-300" />
                                            <p className="text-sm">
                                                No hay asignaciones {activeTab === "actual" ? "activas" : "históricas"} disponibles
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedRecords.map((asignacion) => (
                                    <TableRow
                                        key={asignacion.id}
                                        className="border-slate-100 transition-colors hover:bg-green-50/40"
                                    >
                                        <TableCell className="whitespace-normal px-3 py-3 font-medium text-slate-800">
                                            {asignacion.grado}
                                        </TableCell>
                                        <TableCell className="px-3 py-3">
                                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                                {asignacion.modalidad}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-3 py-3 font-mono text-xs text-slate-500">
                                            #{asignacion.id}
                                        </TableCell>
                                        <TableCell className="whitespace-normal px-3 py-3 text-slate-700">
                                            {asignacion.materia}
                                        </TableCell>
                                        <TableCell className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="tabular-nums text-slate-700">{asignacion.anioLectivo}</span>
                                                {asignacion.activo && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                                                        Activo
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 py-3 text-center">
                                            <span className="inline-block min-w-8 rounded-md bg-slate-100 px-2 py-0.5 text-sm font-semibold tabular-nums text-slate-700">
                                                {asignacion.cantidadEstudiantes}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-3 py-3 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!asignacion?.esquela}
                                                onClick={() => onVerGrupo(asignacion.esquela)}
                                                title={asignacion?.esquela ? undefined : "Este grupo todavía no tiene esquela creada"}
                                                className={cn(
                                                    "gap-2",
                                                    asignacion?.esquela
                                                        ? "border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
                                                        : "border-slate-200 text-slate-400",
                                                )}
                                            >
                                                <Users className="h-4 w-4" />
                                                {asignacion?.esquela ? "Ver Esquela" : "Esquela no creada"}
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
                        asignaci{displayedRecords.length !== 1 ? "ones" : "ón"}
                    </span>
                    {activeTab === "actual" && asignacionesActuales.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
                            <Users className="h-4 w-4" />
                            Total de estudiantes:{" "}
                            {asignacionesActuales.reduce((sum, a) => sum + a.cantidadEstudiantes, 0)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
