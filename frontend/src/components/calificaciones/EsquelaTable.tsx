"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import React, { useEffect, useState } from "react"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { getEsquelaHeadById, getEsquelaResumen } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHead } from "./EsquelaHead"
import { CentroEscolar } from "@/interfaces/centroInterface"
import { getCentros } from "@/actions/centroMethods/centroEducativoMethods"
import type {
    AsignaturaCalificada,
    CorteCalificado,
    EsquelaResumen,
    EstudianteCalificado,
    NotaCalculada,
} from "@/interfaces/calificaciones/EsquelaResumen"

function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
}

interface EsquelaTableProps {
    esquelaHeadId: number
    corteFilter?: "all" | "1" | "2" | "1S" | "3" | "4" | "2S" | "F"
}

const NOTA_VACIA: NotaCalculada = { cuant: 0, cual: "AI", cualitativaId: null }

export function EsquelaTable({ esquelaHeadId, corteFilter = "all" }: EsquelaTableProps) {
    const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadInterface>()
    const [resumen, setResumen] = useState<EsquelaResumen | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [centro, setCentro] = useState<CentroEscolar | null>(null)

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [headResponse, centros, resumenResponse] = await Promise.all([
                    getEsquelaHeadById(Number(esquelaHeadId)),
                    getCentros(),
                    getEsquelaResumen(Number(esquelaHeadId)),
                ])

                setEsquelaHead(headResponse)
                setResumen(resumenResponse)

                if (centros?.length) {
                    setCentro(centros[0])
                }
            } catch (error) {
                console.error("Error cargando datos de la esquela:", error)
                setError("No se pudieron cargar las calificaciones de la esquela.")
            }
        }

        fetchAllData()
    }, [esquelaHeadId])

    const colegio = centro?.nombreCentro ?? "N/A"
    const grupo = esquelaHead?.grupo_asignatura?.grado?.grades ?? "N/A"
    const docenteGuia = esquelaHead?.grupo_asignatura?.docenteGuia.nombres ?? "N/A"
    const asignaturas = esquelaHead?.grupo_asignatura?.grupoAsignaturaDocente ?? []
    const section = esquelaHead?.grupo_asignatura?.seccion.seccion ?? "N/A"
    const modalidad = esquelaHead?.grupo_asignatura?.organizacionEscolar?.turno?.modalidad?.modalidad ?? "N/A"
    const shift = esquelaHead?.grupo_asignatura?.organizacionEscolar?.turno?.turno ?? "N/A"
    const anioLectivo = esquelaHead?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0


    const estudiantes: EstudianteCalificado[] = React.useMemo(() => {
        const todos = resumen?.estudiantes ?? []
        return corteFilter === "all" ? todos : todos.filter((est) => est.activoEnGrupo !== false)
    }, [resumen, corteFilter])

    const notasMap = React.useMemo(() => {
        const map = new Map<string, AsignaturaCalificada>()
        resumen?.estudiantes.forEach((est) => {
            est.asignaturas.forEach((asig) => {
                map.set(`${est.id}-${asig.asignaturaId}`, asig)
            })
        })
        return map
    }, [resumen])

    const notaDeCorte = (estId: number, asigId: number, corteId: number): CorteCalificado | undefined =>
        notasMap.get(`${estId}-${asigId}`)?.cortes.find((corte) => corte.corteId === corteId)

    // Período seleccionado cuando el filtro es un semestre
    const periodoVisible = React.useMemo(() => {
        const periodos = resumen?.periodos ?? []
        if (periodos.length < 2) return null
        if (corteFilter === "1S") return periodos[0]
        if (corteFilter === "2S") return periodos[1]
        return null
    }, [resumen, corteFilter])

    const cortesVisibles = React.useMemo(() => {
        const cortes = resumen?.cortes ?? []
        if (corteFilter === "all" || corteFilter === "F") return cortes

        if (corteFilter === "1S" || corteFilter === "2S") {
            if (periodoVisible) {
                return cortes.filter((corte) => periodoVisible.cortes.includes(corte.id))
            }
            // Sin períodos configurados: mitad y mitad
            const mitad = Math.ceil(cortes.length / 2)
            return corteFilter === "1S" ? cortes.slice(0, mitad) : cortes.slice(mitad)
        }

        const corte = cortes[Number(corteFilter) - 1] ?? cortes.find((item) => item.id === Number(corteFilter))
        return corte ? [corte] : []
    }, [resumen, corteFilter, periodoVisible])

    const notaPromedio = (estId: number, asigId: number): NotaCalculada => {
        const asignatura = notasMap.get(`${estId}-${asigId}`)
        if (!asignatura) return NOTA_VACIA

        if (periodoVisible) {
            const periodo = asignatura.periodos.find((item) => item.periodoId === periodoVisible.id)
            if (periodo) return periodo
        }

        if (corteFilter === "all" || corteFilter === "F" || cortesVisibles.length === 0) {
            return asignatura.final
        }

        const corte = notaDeCorte(estId, asigId, cortesVisibles[0].id)
        if (!corte) return NOTA_VACIA

        return {
            cuant: corte.cuant,
            cual: corte.registrado ? corte.cual : "AI",
            cualitativaId: corte.cualitativaId,
        }
    }

    return (
        <div className="w-full space-y-6 bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen p-4">
            <EsquelaHead
                nombreCentro={colegio}
                grade={grupo}
                section={section}
                shift={shift}
                year={anioLectivo}
                modality={modalidad}
                teacherName={docenteGuia}
            />

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-rose-100 to-pink-100 border-b-2 border-rose-200">
                                    <TableHead rowSpan={2} className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Nº</TableHead>
                                    <TableHead rowSpan={2} className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Foto</TableHead>
                                    <TableHead rowSpan={2} className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[200px]">Estudiante</TableHead>
                                    <TableHead rowSpan={2} className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[120px]">Código</TableHead>
                                    <TableHead rowSpan={2} className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Sexo</TableHead>
                                    {asignaturas.map((asig, idx) => (
                                        <TableHead key={idx} colSpan={cortesVisibles.length * 2 + 1} className={`font-bold border-r border-rose-200 text-center ${idx % 3 === 0 ? "text-emerald-900 bg-emerald-100" : idx % 3 === 1 ? "text-amber-900 bg-amber-100" : "text-violet-900 bg-violet-100"}`}>
                                            {asig.asignatura?.asignatura ?? "Asignatura"}
                                        </TableHead>
                                    ))}
                                </TableRow>
                                <TableRow className="bg-rose-50 border-b border-rose-200">
                                    {asignaturas.map((_, idx) => (
                                        <React.Fragment key={`sub-${idx}`}>
                                            {cortesVisibles.map((_, i) => (
                                                <React.Fragment key={`sub-${idx}-${i}`}>
                                                    <TableHead className={`text-xs font-semibold text-center border-r border-rose-100 ${idx % 3 === 0 ? "bg-emerald-50 text-emerald-800" : idx % 3 === 1 ? "bg-amber-50 text-amber-800" : "bg-violet-50 text-violet-800"}`}>
                                                        Cual.
                                                    </TableHead>
                                                    <TableHead className={`text-xs font-semibold text-center border-r border-rose-200 ${idx % 3 === 0 ? "bg-emerald-50 text-emerald-800" : idx % 3 === 1 ? "bg-amber-50 text-amber-800" : "bg-violet-50 text-violet-800"}`}>
                                                        Cuant.
                                                    </TableHead>
                                                </React.Fragment>
                                            ))}
                                            <TableHead className="text-xs font-semibold text-center bg-gray-100 text-gray-700 border-r border-rose-200">
                                                Promedio
                                            </TableHead>
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estudiantes.map((est: EstudianteCalificado, index: number) => (
                                    <TableRow
                                        key={est.id}
                                        className={`${est.activoEnGrupo === false ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-rose-50'} border-b border-rose-200`}
                                    >
                                        <TableCell className="font-bold text-center">{index + 1}</TableCell>
                                        <TableCell className="border-r border-rose-200">
                                            <Avatar className={`h-12 w-12 ring-2 ${est.activoEnGrupo === false ? 'ring-red-200' : 'ring-rose-200'}`}>
                                                {est.profileImage && (
                                                    <AvatarImage src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${est.profileImage}`} alt={[est.name, est.lastName].filter(Boolean).join(" ")} />
                                                )}
                                                <AvatarFallback className={`${est.activoEnGrupo === false ? 'bg-red-100 text-red-700' : 'bg-rose-100 text-rose-700'} font-bold text-sm`}>
                                                    {getInitials([est.name, est.lastName].filter(Boolean).join(" "))}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className={`font-bold text-center ${est.activoEnGrupo === false ? 'text-red-700' : ''}`}>
                                            {[est.name, est.lastName].filter(Boolean).join(" ")}
                                        </TableCell>
                                        <TableCell className={`font-semibold text-center ${est.activoEnGrupo === false ? 'text-red-700' : ''}`}>{est.studentCode}</TableCell>
                                        <TableCell className={`text-center font-bold ${est.activoEnGrupo === false ? 'text-red-700' : ''}`}>{est.gender ?? "—"}</TableCell>

                                        {asignaturas.map((asig, idx) => {
                                            const notas = cortesVisibles.map((corte) => {
                                                const nota = notaDeCorte(est.id, asig.asignatura.id, corte.id)
                                                return {
                                                    cuant: nota?.cuant ?? 0,
                                                    cual: nota?.registrado ? (nota?.cual ?? "AI") : "AI",
                                                }
                                            })
                                            const promedio = notaPromedio(est.id, asig.asignatura.id)

                                            return notas.map((n, i) => (
                                                <React.Fragment key={`${idx}-${i}`}>
                                                    <TableCell className={`text-center text-sm font-medium border-r border-rose-200 ${idx % 3 === 0 ? 'bg-emerald-50 text-emerald-700' : idx % 3 === 1 ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'} ${n.cual === 'AI' ? 'text-red-600 font-bold' : ''}`}>
                                                        {n.cual}
                                                    </TableCell>
                                                    <TableCell className={`text-center font-bold text-base border-r border-rose-200 ${idx % 3 === 0 ? 'bg-emerald-50' : idx % 3 === 1 ? 'bg-amber-50' : 'bg-violet-50'} ${n.cuant < 60 ? 'text-red-600' : ''}`}>
                                                        {n.cuant}
                                                    </TableCell>
                                                </React.Fragment>
                                            )).concat(
                                                <TableCell key={`prom-${idx}`} className={`text-center font-bold bg-gray-100 border-r border-rose-200 ${promedio.cual === 'AI' ? 'text-red-600' : ''}`}>
                                                    {promedio.cuant}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
