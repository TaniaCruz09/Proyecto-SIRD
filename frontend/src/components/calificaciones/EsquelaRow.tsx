"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getGruposById } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods"
import { GrupoEscolar } from "@/interfaces"
import React from "react";
import { getEsquelaHeadById, saveEsquelaHead } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHeadPayload } from "@/interfaces/calificaciones/EsquelaHead"
import { EsquelaHead } from "./EsquelaHead"


function getQualitativeGrade(grade: number): string {
    if (grade >= 90) return "AA"
    if (grade >= 76) return "AS"
    if (grade >= 60) return "AF"
    return "AI"
}

function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
}

interface EsquelaRowProps {
    grupoId: number
    esquelaHeadId: number
}

export function EsquelaRow({ grupoId, esquelaHeadId }: EsquelaRowProps) {
    const [grupos, setGrupos] = useState<GrupoEscolar>()
    const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadPayload>()
    const [loading, setLoading] = useState(false)

    const fetchGrupoById = async () => {
        try {
            const response = await getGruposById(Number(grupoId))
            setGrupos(response)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchEsquelaHeadById = async () => {
        try {
            const response = await getEsquelaHeadById(Number(esquelaHeadId))
            setEsquelaHead(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGrupoById()
    }, [grupoId])

    // Sacar info base de la primera organización encontrada
    const idAnioLectivo = grupos?.organizacionEscolar?.anio_lectivo?.id ?? 0
    const anioLectivo = grupos?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0
    const grupo = grupos?.grado.grades ?? "N/A"
    const docenteGuia = grupos?.docenteGuia.nombres ?? "N/A"
    const asignaturasDelGrupo = grupos?.grupoAsignaturaDocente ?? [];
    const gradoId = grupos?.grado.id ?? 0
    const section = grupos?.seccion.seccion ?? "N/A"
    const modalidad = grupos?.turno.modalidad?.modalidad ?? "N/A"
    const shift = grupos?.turno.turno ?? "N/A"

    const asignaturas = grupos?.grupoAsignaturaDocente ?? []
    const estudiantes =
        grupos?.grupoAsignaturaDocente
            ?.flatMap((gad) => gad.gruposConEstudiantes.map((ge) => ge.estudiante))
            .filter((v, i, self) => self.findIndex((s) => s.id === v.id) === i) ?? []

    return (
        <div className="w-full space-y-6 bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen p-4 ">
            <EsquelaHead
                schoolName="Instituto Ruben Dario"
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
                                {/* ENCABEZADO PRINCIPAL */}
                                <TableRow className="bg-gradient-to-r from-rose-100 to-pink-100 border-b-2 border-rose-200">
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Nº</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Foto</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[200px]">Estudiante</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[120px]">Código</TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center min-w-[80px]">Sexo</TableHead>

                                    {asignaturas.map((asig, idx) => (
                                        <TableHead
                                            key={idx}
                                            className={`font-bold border-r border-rose-200 text-center ${idx % 3 === 0
                                                ? "text-emerald-900 bg-emerald-100"
                                                : idx % 3 === 1
                                                    ? "text-amber-900 bg-amber-100"
                                                    : "text-violet-900 bg-violet-100"
                                                }`}
                                            colSpan={14}
                                        >
                                            {asig.asignatura?.asignatura ?? "Asignatura"}
                                        </TableHead>
                                    ))}

                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center bg-rose-100 min-w-[100px]">
                                        🏆 Nota Final
                                    </TableHead>
                                </TableRow>

                                {/* SUBENCABEZADO (Parciales/Semestres) */}
                                <TableRow className="bg-rose-50 border-b border-rose-200">
                                    <TableHead colSpan={5}></TableHead>
                                    {asignaturas.map((_, idx) => (
                                        <React.Fragment key={idx}>
                                            {["1er Parcial", "2do Parcial", "1er Semestre", "3er Parcial", "4to Parcial", "2do Semestre", "Nota Final"].map(
                                                (title, i) => (
                                                    <TableHead
                                                        key={i}
                                                        className={`font-medium border-r border-rose-200 text-center text-xs min-w-[60px] ${idx % 3 === 0
                                                            ? i === 2 || i === 5 || i === 6
                                                                ? "bg-emerald-200 text-emerald-900 font-bold"
                                                                : "bg-emerald-50 text-emerald-800"
                                                            : idx % 3 === 1
                                                                ? i === 2 || i === 5 || i === 6
                                                                    ? "bg-amber-200 text-amber-900 font-bold"
                                                                    : "bg-amber-50 text-amber-800"
                                                                : i === 2 || i === 5 || i === 6
                                                                    ? "bg-violet-200 text-violet-900 font-bold"
                                                                    : "bg-violet-50 text-violet-800"
                                                            }`}
                                                        colSpan={2}
                                                    >
                                                        {title}
                                                    </TableHead>
                                                )
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <TableHead></TableHead>
                                </TableRow>

                                {/* SUBSUBENCABEZADO Cuant/Cual */}
                                <TableRow className="bg-rose-100 border-b border-rose-200">
                                    <TableHead colSpan={5}></TableHead>
                                    {asignaturas.map((_, idx) => (
                                        <React.Fragment key={idx}>
                                            {Array.from({ length: 7 }, (_, i) => (
                                                <React.Fragment key={i}>
                                                    <TableHead
                                                        className={`font-medium border-r border-rose-200 text-center text-xs min-w-[50px] ${idx % 3 === 0
                                                            ? "bg-emerald-50 text-emerald-800"
                                                            : idx % 3 === 1
                                                                ? "bg-amber-50 text-amber-800"
                                                                : "bg-violet-50 text-violet-800"
                                                            }`}
                                                    >
                                                        Cuant.
                                                    </TableHead>
                                                    <TableHead
                                                        className={`font-medium border-r border-rose-200 text-center text-xs min-w-[40px] ${idx % 3 === 0
                                                            ? "bg-emerald-50 text-emerald-800"
                                                            : idx % 3 === 1
                                                                ? "bg-amber-50 text-amber-800"
                                                                : "bg-violet-50 text-violet-800"
                                                            }`}
                                                    >
                                                        Cual.
                                                    </TableHead>
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>

                            {/* FILAS DE ESTUDIANTES */}
                            <TableBody>
                                {estudiantes.map((est, index) => (
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

                                        {asignaturas.map((asig, idx) => (
                                            <React.Fragment key={`${est.id}-${idx}`}>
                                                {Array.from({ length: 7 }, (_, i) => (
                                                    <React.Fragment key={i}>
                                                        <TableCell
                                                            className={`text-center font-bold text-base border-r border-rose-200 ${idx % 3 === 0
                                                                ? "bg-emerald-50"
                                                                : idx % 3 === 1
                                                                    ? "bg-amber-50"
                                                                    : "bg-violet-50"
                                                                }`}
                                                        >
                                                            {/* Valor cuantitativo simulado */}
                                                            {Math.floor(Math.random() * 40) + 60}
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-center text-sm font-medium border-r border-rose-200 ${idx % 3 === 0
                                                                ? "text-emerald-700 bg-emerald-50"
                                                                : idx % 3 === 1
                                                                    ? "text-amber-700 bg-amber-50"
                                                                    : "text-violet-700 bg-violet-50"
                                                                }`}
                                                        >
                                                            {/* Valor cualitativo generado */}
                                                            {getQualitativeGrade(Math.floor(Math.random() * 40) + 60)}
                                                        </TableCell>
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}

                                        <TableCell className="text-center font-bold text-rose-900 bg-rose-100">Aprobado</TableCell>
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