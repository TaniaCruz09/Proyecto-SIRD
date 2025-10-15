"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { EsquelaHead } from "./EsquelaHead"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getGruposById } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods"
import { GrupoEscolar } from "@/interfaces"

interface Student {
    id: string
    code: string
    fullName: string
    gender: "M" | "F"
    avatar?: string
    mathematics: {
        quantitative1: number
        qualitative1: string
        quantitative2: number
        qualitative2: string
        quantitative3: number
        qualitative3: string
        quantitative4: number
        qualitative4: string
    }
    spanish: {
        quantitative1: number
        qualitative1: string
        quantitative2: number
        qualitative2: string
        quantitative3: number
        qualitative3: string
        quantitative4: number
        qualitative4: string
    }
    science: {
        quantitative1: number
        qualitative1: string
        quantitative2: number
        qualitative2: string
        quantitative3: number
        qualitative3: string
        quantitative4: number
        qualitative4: string
    }
}

const sampleStudents: Student[] = [
    {
        id: "1",
        code: "EST001",
        fullName: "María González Pérez",
        gender: "F",
        avatar: "/estudiante-mujer-sonriente.jpg",
        mathematics: {
            quantitative1: 85,
            qualitative1: "Excelente",
            quantitative2: 78,
            qualitative2: "Bueno",
            quantitative3: 92,
            qualitative3: "Sobresaliente",
            quantitative4: 88,
            qualitative4: "Excelente",
        },
        spanish: {
            quantitative1: 90,
            qualitative1: "Sobresaliente",
            quantitative2: 85,
            qualitative2: "Excelente",
            quantitative3: 88,
            qualitative3: "Excelente",
            quantitative4: 92,
            qualitative4: "Sobresaliente",
        },
        science: {
            quantitative1: 82,
            qualitative1: "Excelente",
            quantitative2: 79,
            qualitative2: "Bueno",
            quantitative3: 86,
            qualitative3: "Excelente",
            quantitative4: 84,
            qualitative4: "Excelente",
        },
    },
    {
        id: "2",
        code: "EST002",
        fullName: "Carlos Rodríguez López",
        gender: "M",
        mathematics: {
            quantitative1: 72,
            qualitative1: "Aceptable",
            quantitative2: 68,
            qualitative2: "Aceptable",
            quantitative3: 75,
            qualitative3: "Bueno",
            quantitative4: 80,
            qualitative4: "Bueno",
        },
        spanish: {
            quantitative1: 78,
            qualitative1: "Bueno",
            quantitative2: 74,
            qualitative2: "Aceptable",
            quantitative3: 82,
            qualitative3: "Excelente",
            quantitative4: 79,
            qualitative4: "Bueno",
        },
        science: {
            quantitative1: 70,
            qualitative1: "Aceptable",
            quantitative2: 73,
            qualitative2: "Aceptable",
            quantitative3: 77,
            qualitative3: "Bueno",
            quantitative4: 81,
            qualitative4: "Bueno",
        },
    },
    {
        id: "3",
        code: "EST003",
        fullName: "Ana Sofía Martínez",
        gender: "F",
        avatar: "/estudiante-joven-concentrada.jpg",
        mathematics: {
            quantitative1: 90,
            qualitative1: "Sobresaliente",
            quantitative2: 94,
            qualitative2: "Sobresaliente",
            quantitative3: 87,
            qualitative3: "Excelente",
            quantitative4: 91,
            qualitative4: "Sobresaliente",
        },
        spanish: {
            quantitative1: 93,
            qualitative1: "Sobresaliente",
            quantitative2: 89,
            qualitative2: "Excelente",
            quantitative3: 95,
            qualitative3: "Sobresaliente",
            quantitative4: 88,
            qualitative4: "Excelente",
        },
        science: {
            quantitative1: 91,
            qualitative1: "Sobresaliente",
            quantitative2: 87,
            qualitative2: "Excelente",
            quantitative3: 93,
            qualitative3: "Sobresaliente",
            quantitative4: 89,
            qualitative4: "Excelente",
        },
    },
]

function calculateFirstSemester(subject: any): { quantitative: number; qualitative: string } {
    const avg = Math.round((subject.quantitative1 + subject.quantitative2) / 2)
    return {
        quantitative: avg,
        qualitative: getQualitativeGrade(avg),
    }
}

function calculateSecondSemester(subject: any): { quantitative: number; qualitative: string } {
    const avg = Math.round((subject.quantitative3 + subject.quantitative4) / 2)
    return {
        quantitative: avg,
        qualitative: getQualitativeGrade(avg),
    }
}

function calculateSubjectFinal(firstSem: number, secondSem: number): { quantitative: number; qualitative: string } {
    const avg = Math.round((firstSem + secondSem) / 2)
    return {
        quantitative: avg,
        qualitative: getQualitativeGrade(avg),
    }
}

function getQualitativeGrade(grade: number): string {
    if (grade >= 90) return "S" // Sobresaliente
    if (grade >= 80) return "E" // Excelente
    if (grade >= 70) return "B" // Bueno
    if (grade >= 60) return "A" // Aceptable
    return "I" // Insuficiente
}

function calculateSubjectAverage(subject: any): number {
    const total = subject.quantitative1 + subject.quantitative2 + subject.quantitative3 + subject.quantitative4
    return Math.round(total / 4)
}

function getStatus(finalGrade: number): string {
    return finalGrade >= 60 ? "Aprobado" : "Reprobado"
}

function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
}

function calculateFinalGrade(mathFinal: number, spanishFinal: number, scienceFinal: number): number {
    const total = mathFinal + spanishFinal + scienceFinal
    return Math.round(total / 3)
}

interface EsquelaRowProps {
    grupoId: number;
}

export function EsquelaRow({ grupoId }: EsquelaRowProps) {
    const [grupos, setGrupos] = useState<GrupoEscolar>();

    const fetchGrupoById = async () => {
        try {
            const response = await getGruposById(Number(grupoId))
            setGrupos(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGrupoById()

    }, [grupoId]);

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
                                <TableRow className="bg-gradient-to-r from-rose-100 to-pink-100 hover:from-rose-100 hover:to-pink-100 border-b-2 border-rose-200">
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 bg-white text-center min-w-[80px]">
                                        Nº
                                    </TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 bg-white text-center min-w-[80px]">
                                        Foto
                                    </TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 bg-white text-center min-w-[80px]">
                                        Estudiante
                                    </TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 bg-white text-center min-w-[200px]">
                                        Código
                                    </TableHead>
                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center bg-white min-w-[60px]">
                                        Sexo
                                    </TableHead>

                                    <TableHead
                                        className="font-bold text-emerald-900 border-r border-rose-200 text-center bg-emerald-100"
                                        colSpan={14}
                                    >
                                        📐 Matemáticas
                                    </TableHead>

                                    <TableHead
                                        className="font-bold text-amber-900 border-r border-rose-200 text-center bg-amber-100"
                                        colSpan={14}
                                    >
                                        📚 Español
                                    </TableHead>

                                    <TableHead
                                        className="font-bold text-violet-900 border-r border-rose-200 text-center bg-violet-100"
                                        colSpan={14}
                                    >
                                        🔬 Ciencias
                                    </TableHead>

                                    <TableHead className="font-bold text-rose-900 border-r border-rose-200 text-center bg-rose-100 min-w-[100px]">
                                        🏆 Nota Final
                                    </TableHead>
                                </TableRow>

                                <TableRow className="bg-rose-50 hover:bg-rose-50 border-b border-rose-200">
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>

                                    <TableHead
                                        className="font-medium text-emerald-800 border-r border-rose-200 text-center text-xs bg-emerald-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        1er Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-emerald-800 border-r border-rose-200 text-center text-xs bg-emerald-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        2do Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-emerald-900 border-r border-rose-200 text-center text-xs bg-emerald-200 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        1er Semestre
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-emerald-800 border-r border-rose-200 text-center text-xs bg-emerald-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        3er Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-emerald-800 border-r border-rose-200 text-center text-xs bg-emerald-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        4to Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-emerald-900 border-r border-rose-200 text-center text-xs bg-emerald-200 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        2do Semestre
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-emerald-900 border-r border-rose-200 text-center text-xs bg-emerald-300 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        Nota Final
                                    </TableHead>

                                    <TableHead
                                        className="font-medium text-amber-800 border-r border-rose-200 text-center text-xs bg-amber-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        1er Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-amber-800 border-r border-rose-200 text-center text-xs bg-amber-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        2do Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-amber-900 border-r border-rose-200 text-center text-xs bg-amber-200 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        1er Semestre
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-amber-800 border-r border-rose-200 text-center text-xs bg-amber-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        3er Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-amber-800 border-r border-rose-200 text-center text-xs bg-amber-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        4to Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-amber-900 border-r border-rose-200 text-center text-xs bg-amber-200 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        2do Semestre
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-amber-900 border-r border-rose-200 text-center text-xs bg-amber-300 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        Nota Final
                                    </TableHead>

                                    <TableHead
                                        className="font-medium text-violet-800 border-r border-rose-200 text-center text-xs bg-violet-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        1er Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-violet-800 border-r border-rose-200 text-center text-xs bg-violet-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        2do Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-violet-900 border-r border-rose-200 text-center text-xs bg-violet-200 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        1er Semestre
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-violet-800 border-r border-rose-200 text-center text-xs bg-violet-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        3er Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-violet-800 border-r border-rose-200 text-center text-xs bg-violet-50 min-w-[60px]"
                                        colSpan={2}
                                    >
                                        4to Parcial
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-violet-900 border-r border-rose-200 text-center text-xs bg-violet-200 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        2do Semestre
                                    </TableHead>
                                    <TableHead
                                        className="font-medium text-violet-900 border-r border-rose-200 text-center text-xs bg-violet-300 font-bold min-w-[80px]"
                                        colSpan={2}
                                    >
                                        Nota Final
                                    </TableHead>

                                    <TableHead className="border-r border-rose-200"></TableHead>
                                </TableRow>

                                <TableRow className="bg-rose-100 hover:bg-rose-100 border-b border-rose-200">
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>
                                    <TableHead className="border-r border-rose-200"></TableHead>

                                    {Array.from({ length: 7 }, (_, i) => (
                                        <>
                                            <TableHead
                                                key={`math-cuant-${i}`}
                                                className="font-medium text-emerald-800 border-r border-rose-200 text-center text-xs bg-emerald-50 min-w-[50px]"
                                            >
                                                Cuant.
                                            </TableHead>
                                            <TableHead
                                                key={`math-cual-${i}`}
                                                className="font-medium text-emerald-800 border-r border-rose-200 text-center text-xs bg-emerald-50 min-w-[40px]"
                                            >
                                                Cual.
                                            </TableHead>
                                        </>
                                    ))}

                                    {Array.from({ length: 7 }, (_, i) => (
                                        <>
                                            <TableHead
                                                key={`spanish-cuant-${i}`}
                                                className="font-medium text-amber-800 border-r border-rose-200 text-center text-xs bg-amber-50 min-w-[50px]"
                                            >
                                                Cuant.
                                            </TableHead>
                                            <TableHead
                                                key={`spanish-cual-${i}`}
                                                className="font-medium text-amber-800 border-r border-rose-200 text-center text-xs bg-amber-50 min-w-[40px]"
                                            >
                                                Cual.
                                            </TableHead>
                                        </>
                                    ))}

                                    {Array.from({ length: 7 }, (_, i) => (
                                        <>
                                            <TableHead
                                                key={`science-cuant-${i}`}
                                                className="font-medium text-violet-800 border-r border-rose-200 text-center text-xs bg-violet-50 min-w-[50px]"
                                            >
                                                Cuant.
                                            </TableHead>
                                            <TableHead
                                                key={`science-cual-${i}`}
                                                className="font-medium text-violet-800 border-r border-rose-200 text-center text-xs bg-violet-50 min-w-[40px]"
                                            >
                                                Cual.
                                            </TableHead>
                                        </>
                                    ))}

                                    <TableHead className="border-r border-rose-200"></TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {(
                                    grupos?.grupoAsignaturaDocente
                                        ?.flatMap(gad => gad.gruposConEstudiantes.map(ge => ge.estudiante))
                                        // eliminar duplicados por id
                                        .filter((value, index, self) => self.findIndex(v => v.id === value.id) === index) ?? []
                                ).map((estudiante, index) => {
                                    // const mathFirstSem = calculateFirstSemester(student.)
                                    // const mathSecondSem = calculateSecondSemester(student.mathematics)
                                    // const mathFinal = calculateSubjectFinal(mathFirstSem.quantitative, mathSecondSem.quantitative)

                                    // const spanishFirstSem = calculateFirstSemester(student.spanish)
                                    // const spanishSecondSem = calculateSecondSemester(student.spanish)
                                    // const spanishFinal = calculateSubjectFinal(
                                    //     spanishFirstSem.quantitative,
                                    //     spanishSecondSem.quantitative,
                                    // )

                                    // const scienceFirstSem = calculateFirstSemester(student.science)
                                    // const scienceSecondSem = calculateSecondSemester(student.science)
                                    // const scienceFinal = calculateSubjectFinal(
                                    //     scienceFirstSem.quantitative,
                                    //     scienceSecondSem.quantitative,
                                    // )

                                    // const finalGrade = calculateFinalGrade(
                                    //     mathFinal.quantitative,
                                    //     spanishFinal.quantitative,
                                    //     scienceFinal.quantitative,
                                    // )

                                    return (
                                        <TableRow
                                            key={estudiante.id ?? index}
                                            className={`hover:bg-rose-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-rose-25"} border-b border-rose-200`}
                                        >
                                            <TableCell className="border-r border-rose-200 font-bold text-primary text-center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200">
                                                <Avatar className="h-12 w-12 ring-2 ring-rose-200">
                                                    {estudiante.profileImage && (
                                                        <AvatarImage src={`${process.env.NEXT_PUBLIC_API_UPLOADS}${estudiante.profileImage}` || "/placeholder.svg"}
                                                            alt={estudiante.name} />
                                                    )}
                                                    <AvatarFallback className="bg-rose-100 text-rose-700 font-bold text-sm">
                                                        {getInitials(estudiante.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 font-bold text-primary text-center">
                                                {estudiante.name}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 font-semibold text-foreground">
                                                {estudiante.studentCode}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-foreground">
                                                {estudiante.gender.gender}
                                            </TableCell>

                                            {/* <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-emerald-50 min-w-[50px]">
                                                {estudiante.mathematics.quantitative1}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-emerald-700 bg-emerald-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.mathematics.quantitative1)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-emerald-50 min-w-[50px]">
                                                {estudiante.mathematics.quantitative2}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-emerald-700 bg-emerald-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.mathematics.quantitative2)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-emerald-200 text-emerald-900 min-w-[50px]">
                                                {mathFirstSem.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-emerald-200 font-bold text-emerald-900 min-w-[40px]">
                                                {mathFirstSem.qualitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-emerald-50 min-w-[50px]">
                                                {estudiante.mathematics.quantitative3}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-emerald-700 bg-emerald-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.mathematics.quantitative3)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-emerald-50 min-w-[50px]">
                                                {estudiante.mathematics.quantitative4}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-emerald-700 bg-emerald-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.mathematics.quantitative4)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-emerald-200 text-emerald-900 min-w-[50px]">
                                                {mathSecondSem.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-emerald-200 font-bold text-emerald-900 min-w-[40px]">
                                                {mathSecondSem.qualitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-lg bg-emerald-300 text-emerald-900 min-w-[50px]">
                                                {mathFinal.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-emerald-300 font-bold text-emerald-900 min-w-[40px]">
                                                {mathFinal.qualitative}
                                            </TableCell>

                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-amber-50 min-w-[50px]">
                                                {estudiante.spanish.quantitative1}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-amber-700 bg-amber-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.spanish.quantitative1)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-amber-50 min-w-[50px]">
                                                {estudiante.spanish.quantitative2}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-amber-700 bg-amber-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.spanish.quantitative2)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-amber-200 text-amber-900 min-w-[50px]">
                                                {spanishFirstSem.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-amber-200 font-bold text-amber-900 min-w-[40px]">
                                                {spanishFirstSem.qualitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-amber-50 min-w-[50px]">
                                                {estudiante.spanish.quantitative3}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-amber-700 bg-amber-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.spanish.quantitative3)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-amber-50 min-w-[50px]">
                                                {estudiante.spanish.quantitative4}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-amber-700 bg-amber-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.spanish.quantitative4)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-amber-200 text-amber-900 min-w-[50px]">
                                                {spanishSecondSem.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-amber-200 font-bold text-amber-900 min-w-[40px]">
                                                {spanishSecondSem.qualitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-lg bg-amber-300 text-amber-900 min-w-[50px]">
                                                {spanishFinal.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-amber-300 font-bold text-amber-900 min-w-[40px]">
                                                {spanishFinal.qualitative}
                                            </TableCell>

                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-violet-50 min-w-[50px]">
                                                {estudiante.science.quantitative1}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-violet-700 bg-violet-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.science.quantitative1)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-violet-50 min-w-[50px]">
                                                {estudiante.science.quantitative2}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-violet-700 bg-violet-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.science.quantitative2)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-violet-200 text-violet-900 min-w-[50px]">
                                                {scienceFirstSem.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-violet-200 font-bold text-violet-900 min-w-[40px]">
                                                {scienceFirstSem.qualitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-violet-50 min-w-[50px]">
                                                {estudiante.science.quantitative3}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-violet-700 bg-violet-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.science.quantitative3)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-violet-50 min-w-[50px]">
                                                {estudiante.science.quantitative4}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm font-medium text-violet-700 bg-violet-50 min-w-[40px]">
                                                {getQualitativeGrade(estudiante.science.quantitative4)}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-base bg-violet-200 text-violet-900 min-w-[50px]">
                                                {scienceSecondSem.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-violet-200 font-bold text-violet-900 min-w-[40px]">
                                                {scienceSecondSem.qualitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center font-bold text-lg bg-violet-300 text-violet-900 min-w-[50px]">
                                                {scienceFinal.quantitative}
                                            </TableCell>
                                            <TableCell className="border-r border-rose-200 text-center text-sm bg-violet-300 font-bold text-violet-900 min-w-[40px]">
                                                {scienceFinal.qualitative}
                                            </TableCell>

                                            <TableCell className="border-r border-rose-200 text-center bg-rose-50">
                                                <div className="flex flex-col items-center">
                                                    <span
                                                        className={`font-bold text-xl ${finalGrade >= 60 ? "text-emerald-600" : "text-red-600"}`}
                                                    >
                                                        {finalGrade}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-bold ${finalGrade >= 60 ? "text-emerald-600" : "text-red-600"}`}
                                                    >
                                                        {getQualitativeGrade(finalGrade)}
                                                    </span>
                                                </div>
                                            </TableCell> */}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
