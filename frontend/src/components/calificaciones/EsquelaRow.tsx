"use client"

import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { EsquelaHead } from "./EsquelaHead"

/* ================= HELPERS ================= */

function getQualitativeGrade(grade: number): string {
    if (grade >= 90) return "AA"
    if (grade >= 76) return "AS"
    if (grade >= 60) return "AF"
    return "AI"
}

function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
}

/* ================= TYPES ================= */

interface Estudiante {
    id: number
    name: string
    studentCode: string
    gender?: {
        gender?: string
    }
    profileImage?: string | null
}

interface GEItem {
    estudiante: Estudiante
}

interface GADItem {
    asignatura: {
        id: number
        asignatura: string
    }
    gruposConEstudiantes: GEItem[]
}

interface EsquelaRowProps {
    esquelaHeadId: number
}

type VistaType = "ALL" | 0 | 1 | 2 | 3 | 4 | 5 | 6

/* ================= COMPONENT ================= */

export function EsquelaRow({ esquelaHeadId }: EsquelaRowProps) {
    const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadInterface>()
    const [calificaciones, setCalificaciones] = useState<any[]>([])
    const [vista, setVista] = useState<VistaType>("ALL")

    useEffect(() => {
        const fetchData = async () => {
            const response = await getEsquelaHeadById(esquelaHeadId)
            setEsquelaHead(response)

            const anio =
                response?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0

            // Obtener estudiantes únicos
            const estudiantes =
                response?.grupo_asignatura?.grupoAsignaturaDocente
                    ?.flatMap((g: any) =>
                        g.gruposConEstudiantes.map((ge: any) => ge.estudiante)
                    )
                    .filter(
                        (v: any, i: number, self: any[]) =>
                            self.findIndex((s) => s.id === v.id) === i
                    ) ?? []

            if (estudiantes.length) {
                const rows = await Promise.all(
                    estudiantes.map((e: any) => getEsquelaRowByEstudianteAndAnio(e.id, anio))
                )
                setCalificaciones(rows.flat())
            }
        }

        fetchData()
    }, [esquelaHeadId])

    // Mapear datos del backend a tipo interno
    const asignaturas: GADItem[] =
        esquelaHead?.grupo_asignatura?.grupoAsignaturaDocente?.map((g: any) => ({
            asignatura: {
                id: g.asignatura.id,
                asignatura: g.asignatura.asignatura
            },
            gruposConEstudiantes: g.gruposConEstudiantes.map((ge: any) => ({
                estudiante: {
                    id: ge.estudiante.id,
                    name: ge.estudiante.name,
                    studentCode: ge.estudiante.studentCode,
                    gender: ge.estudiante.gender ?? { gender: "—" },
                    profileImage: ge.estudiante.profileImage ?? null
                }
            }))
        })) ?? []

    const estudiantes: Estudiante[] =
        asignaturas
            .flatMap((g) => g.gruposConEstudiantes.map((ge) => ge.estudiante))
            .filter(
                (v, i, self) => self.findIndex((s) => s.id === v.id) === i
            )

    const findNota = (estId: number, asigId: number, corteId: number) => {
        const row = calificaciones.find(
            (r) =>
                Number(r.estudiante.id) === estId &&
                Number(r.asignatura.id) === asigId &&
                Number(r.corte.id) === corteId
        )

        return {
            cuant: row?.notaCuantitativa ?? 0,
            cual: row?.notaCualitativa ?? "AI",
        }
    }

    const cortes = [1, 2, 1, 3, 4, 3, 4]

    /* ================= RENDER ================= */

    return (
        <div className="w-full space-y-6 bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen p-4">

            <EsquelaHead
                schoolName="Instituto Ruben Dario"
                grade={esquelaHead?.grupo_asignatura?.grado.grades ?? ""}
                section={esquelaHead?.grupo_asignatura?.seccion.seccion ?? ""}
                shift={esquelaHead?.grupo_asignatura?.turno.turno ?? ""}
                year={esquelaHead?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0}
                modality={esquelaHead?.grupo_asignatura?.turno.modalidad?.modalidad ?? ""}
                teacherName={esquelaHead?.grupo_asignatura?.docenteGuia.nombres ?? ""}
            />

            {/* BOTONES */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {["1er Parcial", "2do Parcial", "1er Semestre", "3er Parcial", "4to Parcial", "2do Semestre", "Nota Final"].map(
                    (t, i) => (
                        <Button key={i} onClick={() => setVista(i as VistaType)}>
                            {t}
                        </Button>
                    )
                )}
                <Button variant="secondary" onClick={() => setVista("ALL")}>
                    Completa
                </Button>
            </div>

            <Card className="shadow-2xl">
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {/* ENCABEZADOS PRINCIPALES */}
                            <TableRow className="bg-rose-100">
                                <TableHead>Nº</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Estudiante</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Sexo</TableHead>

                                {asignaturas.map((a, idx) => (
                                    <TableHead
                                        key={idx}
                                        colSpan={(vista === "ALL" ? 7 : 1) * 2}
                                        className={`text-center font-bold ${idx % 3 === 0
                                                ? "bg-emerald-100"
                                                : idx % 3 === 1
                                                    ? "bg-amber-100"
                                                    : "bg-violet-100"
                                            }`}
                                    >
                                        {a.asignatura.asignatura}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {estudiantes.map((est, index) => (
                                <TableRow key={est.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Avatar>
                                            {est.profileImage && (
                                                <AvatarImage
                                                    src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${est.profileImage}`}
                                                />
                                            )}
                                            <AvatarFallback>
                                                {getInitials(est.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{est.name}</TableCell>
                                    <TableCell>{est.studentCode}</TableCell>
                                    <TableCell>{est.gender?.gender ?? "—"}</TableCell>

                                    {asignaturas.map((a, aIdx) =>
                                        cortes
                                            .map((corte, i) => ({ corte, i }))
                                            .filter(({ i }) => vista === "ALL" || vista === i)
                                            .map(({ corte, i }) => {
                                                let cuant = 0

                                                if (i === 2) {
                                                    cuant = Math.round(
                                                        (findNota(est.id, a.asignatura.id, 1).cuant +
                                                            findNota(est.id, a.asignatura.id, 2).cuant) / 2
                                                    )
                                                } else if (i === 5) {
                                                    cuant = Math.round(
                                                        (findNota(est.id, a.asignatura.id, 3).cuant +
                                                            findNota(est.id, a.asignatura.id, 4).cuant) / 2
                                                    )
                                                } else if (i === 6) {
                                                    cuant = Math.round(
                                                        (findNota(est.id, a.asignatura.id, 1).cuant +
                                                            findNota(est.id, a.asignatura.id, 2).cuant +
                                                            findNota(est.id, a.asignatura.id, 3).cuant +
                                                            findNota(est.id, a.asignatura.id, 4).cuant) / 4
                                                    )
                                                } else {
                                                    cuant = findNota(est.id, a.asignatura.id, corte).cuant
                                                }

                                                const cual = getQualitativeGrade(cuant)

                                                return (
                                                    <React.Fragment key={`${aIdx}-${i}`}>
                                                        <TableCell
                                                            className={`text-center ${cual === "AI" ? "text-red-600 font-bold" : ""
                                                                }`}
                                                        >
                                                            {cual}
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-center font-bold ${cuant < 60 ? "text-red-600" : ""
                                                                }`}
                                                        >
                                                            {cuant}
                                                        </TableCell>
                                                    </React.Fragment>
                                                )
                                            })
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
