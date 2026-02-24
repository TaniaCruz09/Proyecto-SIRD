"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import React, { useEffect, useState } from "react"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHead } from "./EsquelaHead"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { CentroEscolar } from "@/interfaces/centroInterface"
import { getCentros } from "@/actions/centroMethods/centroEducativoMethods"
import { getNotasCualitativas } from "@/actions/catalogos/notaCualitativaMethods"
import { NotaCualitativa } from "@/interfaces"

function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
}

interface Estudiante {
    id: number
    name: string
    studentCode: string
    gender: { gender: string }
    profileImage?: string
}

interface EsquelaTableProps {
    esquelaHeadId: number
    corteFilter?: "all" | "1" | "2" | "1S" | "3" | "4" | "2S" | "F"
}

export function EsquelaTable({ esquelaHeadId, corteFilter = "all" }: EsquelaTableProps) {
    const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadInterface>()
    const [calificaciones, setCalificaciones] = useState<any[]>([])
    const [centro, setCentro] = useState<CentroEscolar | null>(null)
    const [notasCualitativas, setNotasCualitativas] = useState<NotaCualitativa[]>([])

    const fetchEsquelaHeadById = async () => {
        try {
            const response = await getEsquelaHeadById(Number(esquelaHeadId))
            setEsquelaHead(response)

            const anio = response?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0

            const estudiantes =
                response?.grupo_asignatura?.grupoAsignaturaDocente
                    ?.flatMap((gad: any) => gad.gruposConEstudiantes.map((ge: any) => ge.estudiante))
                    .filter((v: Estudiante, i: number, self: Estudiante[]) => self.findIndex((s) => s.id === v.id) === i) ?? []

            if (estudiantes.length > 0) {
                const allRows = await Promise.all(estudiantes.map((est: Estudiante) => getEsquelaRowByEstudianteAndAnio(est.id, anio)))
                setCalificaciones(allRows.flat())
            }
        } catch (error) {
            console.error(error)
        }
    }
    const fetchCentro = async () => {
        try {
            const centros = await getCentros()
            // Si solo tienes un centro registrado
            setCentro(centros[0])
        } catch (error) {
            console.error("Error cargando centro:", error)
        }
    }
    fetchCentro()
    useEffect(() => {
        fetchEsquelaHeadById()
    }, [esquelaHeadId])

    useEffect(() => {
        const fetchNotas = async () => {
            try {
                const response = await getNotasCualitativas()
                if (Array.isArray(response)) {
                    const ordered = response
                        .slice()
                        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                    setNotasCualitativas(ordered)
                }
            } catch (error) {
                console.error("Error cargando notas cualitativas:", error)
            }
        }

        fetchNotas()
    }, [])

    const colegio = centro?.nombreCentro ?? "N/A"
    const grupo = esquelaHead?.grupo_asignatura?.grado.grades ?? "N/A"
    const docenteGuia = esquelaHead?.grupo_asignatura?.docenteGuia.nombres ?? "N/A"
    const asignaturas = esquelaHead?.grupo_asignatura?.grupoAsignaturaDocente ?? []
    const section = esquelaHead?.grupo_asignatura?.seccion.seccion ?? "N/A"
    const modalidad = esquelaHead?.grupo_asignatura?.turno.modalidad?.modalidad ?? "N/A"
    const shift = esquelaHead?.grupo_asignatura?.turno.turno ?? "N/A"
    const anioLectivo = esquelaHead?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0


    const estudiantes: Estudiante[] =
        asignaturas
            ?.flatMap((gad) => gad.gruposConEstudiantes.map((ge: any) => ge.estudiante))
            .filter((v, i, self) => self.findIndex((s) => s.id === v.id) === i) ?? []

    const getQualitativeGrade = (grade: number): string => {
        if (!Number.isFinite(grade)) return "AI"
        const match = notasCualitativas.find(
            (nota) => grade >= nota.rango_menor && grade <= nota.rango_mayor
        )
        return match?.abreviatura ?? "AI"
    }

    const findNota = (estId: number, asigId: number, corteId: number) => {
        const row = calificaciones.find(
            (r) =>
                Number(r.estudiante.id) === Number(estId) &&
                Number(r.asignatura.id) === Number(asigId) &&
                Number(r.corte.id) === Number(corteId)
        )
        return {
            cuant: row?.notaCuantitativa ?? 0,
            cual: row?.notaCualitativa ?? "AI",
        }
    }

    // Map de cortes según filtro
    const cortesMap = {
        "all": [1, 2, 1, 3, 4, 3, 4], // todos
        "1": [1],
        "2": [2],
        "1S": [1, 2],
        "3": [3],
        "4": [4],
        "2S": [3, 4],
        "F": [1, 2, 3, 4],
    }
    const cortesToRender = cortesMap[corteFilter]

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

            <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-rose-100 to-pink-100 border-b-2 border-rose-200">
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Nº</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Foto</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[200px]">Estudiante</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[120px]">Código</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Sexo</TableHead>
                                    {asignaturas.map((asig, idx) => (
                                        <TableHead key={idx} className={`font-bold border-r border-rose-200 text-center ${idx % 3 === 0 ? "text-emerald-900 bg-emerald-100" : idx % 3 === 1 ? "text-amber-900 bg-amber-100" : "text-violet-900 bg-violet-100"}`}>
                                            {asig.asignatura?.asignatura ?? "Asignatura"}
                                        </TableHead>
                                    ))}
                                    <TableHead className="font-bold border-r border-rose-200 text-center bg-gray-200">Promedio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estudiantes.map((est: Estudiante, index: number) => (
                                    <TableRow key={est.id} className="hover:bg-rose-50 border-b border-rose-200">
                                        <TableCell className="font-bold text-center">{index + 1}</TableCell>
                                        <TableCell className="border-r border-rose-200">
                                            <Avatar className="h-12 w-12 ring-2 ring-rose-200">
                                                {est.profileImage && (
                                                    <AvatarImage src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${est.profileImage}`} alt={est.name} />
                                                )}
                                                <AvatarFallback className="bg-rose-100 text-rose-700 font-bold text-sm">
                                                    {getInitials(est.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-bold text-center">{est.name}</TableCell>
                                        <TableCell className="font-semibold text-center">{est.studentCode}</TableCell>
                                        <TableCell className="text-center font-bold">{est.gender.gender}</TableCell>

                                        {asignaturas.map((asig, idx) => {
                                            const notas = cortesToRender.map(corte => findNota(est.id, asig.asignatura.id, corte))
                                            const promedio = Math.round(notas.reduce((sum, n) => sum + n.cuant, 0) / notas.length)

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
                                                <TableCell key={`prom-${idx}`} className="text-center font-bold bg-gray-100 border-r border-rose-200">
                                                    {promedio}
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
