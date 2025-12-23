"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import React, { useEffect, useState } from "react"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { getEsquelaHeadById } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHead } from "./EsquelaHead"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"
import { Button } from "../ui/button"
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
function getQualitativeGrade(grade: number): string {
    if (grade >= 90) return "AA"
    if (grade >= 76) return "AS"
    if (grade >= 60) return "AF"
    return "AI"
}

interface Estudiante {
    id: number;
    [key: string]: any;
}

interface GEItem {
    estudiante: Estudiante;
}

interface GADItem {
    gruposConEstudiantes: GEItem[];
}

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

interface EsquelaRowProps {
    esquelaHeadId: number
}

export function EsquelaRow({ esquelaHeadId }: EsquelaRowProps) {
    const [esquelaHead, setEsquelaHead] = useState<EsquelaHeadInterface>()
    const [calificaciones, setCalificaciones] = useState<any[]>([])

    const fetchEsquelaHeadById = async () => {
        try {
            const response = await getEsquelaHeadById(Number(esquelaHeadId))
            setEsquelaHead(response)

            const anio = response?.grupo_asignatura?.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? 0

            const estudiantes =
                response?.grupo_asignatura?.grupoAsignaturaDocente
                    ?.flatMap((gad: GADItem) => gad.gruposConEstudiantes.map((ge: GEItem) => ge.estudiante))
                    .filter((v: Estudiante, i: number, self: Estudiante[]) => self.findIndex((s) => s.id === v.id) === i) ?? []

            if (estudiantes.length > 0) {
                const allRows = await Promise.all(estudiantes.map((est: Estudiante) => getEsquelaRowByEstudianteAndAnio(est.id, anio)))
                const mergedRows = allRows.flat()
                setCalificaciones(mergedRows)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchEsquelaHeadById()
    }, [esquelaHeadId])

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

   const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Esquela");

    const border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
    };

    function style(cell: any, bold = false, size = 12) {
        cell.font = { bold, size };
        cell.border = border;
        cell.alignment = { horizontal: "center", vertical: "middle" };
    }

    // ======================
    // 1. TÍTULO
    // ======================
    sheet.addRow(["Instituto Ruben Dario"]);
    sheet.mergeCells(1, 1, 1, 80);
    sheet.getCell("A1").font = { bold: true, size: 18 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.addRow([]);
    sheet.addRow(["Grado:", grupo, "Sección:", section, "Año:", anioLectivo]);
    sheet.addRow(["Turno:", shift, "Modalidad:", modalidad, "Docente Guía:", docenteGuia]);
    sheet.addRow([]);
    sheet.addRow([]);

    // ======================
    // 2. FILA DE BASEHEADERS
    // ======================
    const baseHeaders = ["N°", "Foto", "Estudiante", "Código", "Sexo"];
    const baseRowIndex = sheet.rowCount + 1;
    sheet.addRow(baseHeaders);

    // ======================
    // 3. FILA DE MATERIAS (COMBINADA)
    // ======================
    let colStart = 6; // columna después de "Sexo"

    asignaturas.forEach(asig => {
        const colEnd = colStart + 14 - 1;

        sheet.mergeCells(baseRowIndex, colStart, baseRowIndex, colEnd);
        const cell = sheet.getCell(baseRowIndex, colStart);
        cell.value = asig.asignatura.asignatura;
        cell.font = { bold: true, size: 13 };
        cell.alignment = { horizontal: "center" };

        colStart += 14;
    });

    // ======================
    // 4. FILA DE PARCIALES/SEMESTRES
    // ======================
    const cortes = [
        "1er Parcial", "2do Parcial", "1er Semestre",
        "3er Parcial", "4to Parcial", "2do Semestre", "Nota Final"
    ];

    const cortesRow = [...baseHeaders];

    asignaturas.forEach(() => {
        cortes.forEach(label => {
            cortesRow.push(label);
            cortesRow.push("");  // porque cada uno debe ocupar 2 columnas
        });
    });

    const cortesExcelRow = sheet.addRow(cortesRow);

    // unir cada etiqueta con su "columna vacía"
    let col = 6;
    asignaturas.forEach(() => {
        cortes.forEach(() => {
            sheet.mergeCells(cortesExcelRow.number, col, cortesExcelRow.number, col + 1);
            col += 2;
        });
    });

    cortesExcelRow.eachCell(cell => style(cell, true));

    // ======================
    // 5. FILA CUAL / CUANT
    // ======================
    const subRow = [...baseHeaders];

    asignaturas.forEach(() => {
        for (let i = 0; i < 7; i++) {
            subRow.push("Cual.");
            subRow.push("Cuant.");
        }
    });

    const subExcelRow = sheet.addRow(subRow);
    subExcelRow.eachCell(c => style(c));

    // ======================
    // 6. FILAS DE ESTUDIANTES
    // ======================
    estudiantes.forEach((est, index) => {
        const rowData = [
            index + 1,
            "",
            est.name,
            est.studentCode,
            est.gender.gender
        ];

        asignaturas.forEach(asig => {
            [1, 2, 1, 3, 4, 3, 4].forEach((corte, i) => {
                let n;

                if (i === 2) {
                    const n1 = findNota(est.id, asig.asignatura.id, 1).cuant;
                    const n2 = findNota(est.id, asig.asignatura.id, 2).cuant;
                    const avg = Math.round((n1 + n2) / 2);
                    n = { cual: getQualitativeGrade(avg), cuant: avg };
                } else if (i === 5) {
                    const n3 = findNota(est.id, asig.asignatura.id, 3).cuant;
                    const n4 = findNota(est.id, asig.asignatura.id, 4).cuant;
                    const avg = Math.round((n3 + n4) / 2);
                    n = { cual: getQualitativeGrade(avg), cuant: avg };
                } else if (i === 6) {
                    const n1 = findNota(est.id, asig.asignatura.id, 1).cuant;
                    const n2 = findNota(est.id, asig.asignatura.id, 2).cuant;
                    const n3 = findNota(est.id, asig.asignatura.id, 3).cuant;
                    const n4 = findNota(est.id, asig.asignatura.id, 4).cuant;
                    const final = Math.round((n1 + n2 + n3 + n4) / 4);
                    n = { cual: getQualitativeGrade(final), cuant: final };
                } else {
                    n = findNota(est.id, asig.asignatura.id, corte);
                }

                rowData.push(n.cual);
                rowData.push(n.cuant);
            });
        });

        const row = sheet.addRow(rowData);
        row.eachCell(c => style(c));
    });

    sheet.columns.forEach(col => col.width = 12);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Esquela.xlsx");
};
    return (
        <div className="w-full space-y-6 bg-gradient-to-br from-rose-50 via-pink-50 to-white min-h-screen p-4">
            <EsquelaHead
                schoolName="Instituto Ruben Dario"
                grade={grupo}
                section={section}
                shift={shift}
                year={anioLectivo}
                modality={modalidad}
                teacherName={docenteGuia}
            />
            {/* BOTONES PARA LAS 7 VISTAS */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
                <button
                    className="bg-indigo-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    1er Parcial
                </button>

                <button
                    className="bg-indigo-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    2do Parcial
                </button>

                <button
                    className="bg-indigo-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    1er Semestre
                </button>

                <button
                    className="bg-indigo-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    3er Parcial
                </button>

                <button
                    className="bg-indigo-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    4to Parcial
                </button>

                <button
                    className="bg-indigo-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    2do Semestre
                </button>

                <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow"
                >
                    Nota Final
                </button>
            </div>
            <Button onClick={exportToExcel} className="bg-green-600 text-white">
                Exportar a Excel
            </Button>

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
                                                        className={`font-medium border-r border-rose-200 text-center text-xs min-w-[40px] ${idx % 3 === 0 ? "bg-emerald-50 text-emerald-800" : idx % 3 === 1 ? "bg-amber-50 text-amber-800" : "bg-violet-50 text-violet-800"}`}
                                                    >
                                                        Cual.
                                                    </TableHead>
                                                    <TableHead
                                                        className={`font-medium border-r border-rose-200 text-center text-xs min-w-[50px] ${idx % 3 === 0 ? "bg-emerald-50 text-emerald-800" : idx % 3 === 1 ? "bg-amber-50 text-amber-800" : "bg-violet-50 text-violet-800"}`}
                                                    >
                                                        Cuant.
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

                                        {asignaturas.map((asig, idx) => (
                                            <React.Fragment key={`${est.id}-${idx}`}>
                                                {[1, 2, 1, 3, 4, 3, 4].map((corte, i) => {
                                                    let n: { cuant: number; cual: string }
                                                    if (i === 2) {
                                                        const n1 = findNota(est.id, asig.asignatura.id, 1).cuant
                                                        const n2 = findNota(est.id, asig.asignatura.id, 2).cuant
                                                        const promedio = Math.round((n1 + n2) / 2)
                                                        n = { cuant: promedio, cual: getQualitativeGrade(promedio) }
                                                    } else if (i === 5) {
                                                        const n3 = findNota(est.id, asig.asignatura.id, 3).cuant
                                                        const n4 = findNota(est.id, asig.asignatura.id, 4).cuant
                                                        const promedio = Math.round((n3 + n4) / 2)
                                                        n = { cuant: promedio, cual: getQualitativeGrade(promedio) }
                                                    } else if (i === 6) {
                                                        const n1 = findNota(est.id, asig.asignatura.id, 1).cuant
                                                        const n2 = findNota(est.id, asig.asignatura.id, 2).cuant
                                                        const n3 = findNota(est.id, asig.asignatura.id, 3).cuant
                                                        const n4 = findNota(est.id, asig.asignatura.id, 4).cuant
                                                        const final = Math.round((n1 + n2 + n3 + n4) / 4)
                                                        n = { cuant: final, cual: getQualitativeGrade(final) }
                                                    } else {
                                                        n = findNota(est.id, asig.asignatura.id, corte)
                                                    }

                                                    return (
                                                        <React.Fragment key={i}>
                                                            <TableCell
                                                                className={`text-center text-sm font-medium border-r border-rose-200 
                                                                    ${idx % 3 === 0 ? 'bg-emerald-50 text-emerald-700' : idx % 3 === 1 ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'}
                                                                    ${n.cual === 'AI' ? 'text-red-600 font-bold' : ''}`}
                                                            >
                                                                {n.cual}
                                                            </TableCell>
                                                            <TableCell
                                                                className={`text-center font-bold text-base border-r border-rose-200 
                                                                    ${idx % 3 === 0 ? 'bg-emerald-50' : idx % 3 === 1 ? 'bg-amber-50' : 'bg-violet-50'}
                                                                    ${n.cuant < 60 ? 'text-red-600' : ''}`}
                                                            >
                                                                {n.cuant}
                                                            </TableCell>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </React.Fragment>
                                        ))}
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


