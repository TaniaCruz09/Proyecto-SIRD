import { useEffect, useState } from "react"
import { TableCell } from "../ui/table"
import { getNotasCualitativas } from "@/actions/catalogos/notaCualitativaMethods"
import { NotaCualitativa } from "@/interfaces"

interface SubjectProps {
    name: string
    subject: any
    color: string
}

function calculateFirstSemester(
    subject: any,
    getQualitativeGrade: (grade: number) => string
): { quantitative: number; qualitative: string } {
    const avg = Math.round((subject.quantitative1 + subject.quantitative2) / 2)
    return {
        quantitative: avg,
        qualitative: getQualitativeGrade(avg),
    }
}

function calculateSecondSemester(
    subject: any,
    getQualitativeGrade: (grade: number) => string
): { quantitative: number; qualitative: string } {
    const avg = Math.round((subject.quantitative3 + subject.quantitative4) / 2)
    return {
        quantitative: avg,
        qualitative: getQualitativeGrade(avg),
    }
}

function calculateSubjectFinal(
    firstSem: number,
    secondSem: number,
    getQualitativeGrade: (grade: number) => string
): { quantitative: number; qualitative: string } {
    const avg = Math.round((firstSem + secondSem) / 2)
    return {
        quantitative: avg,
        qualitative: getQualitativeGrade(avg),
    }
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

function SubjectRow({ name, subject, color }: SubjectProps) {
    const [notasCualitativas, setNotasCualitativas] = useState<NotaCualitativa[]>([])

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

    const getQualitativeGrade = (grade: number): string => {
        if (!Number.isFinite(grade)) return "AI"
        const match = notasCualitativas.find(
            (nota) => grade >= nota.rango_menor && grade <= nota.rango_mayor
        )
        return match?.abreviatura ?? "AI"
    }

    const firstSem = calculateFirstSemester(subject, getQualitativeGrade)
    const secondSem = calculateSecondSemester(subject, getQualitativeGrade)
    const final = calculateSubjectFinal(firstSem.quantitative, secondSem.quantitative, getQualitativeGrade)

    return (
        <>
            <TableCell className={`text-center font-bold bg-${color}-50`}>
                {subject.quantitative1}
            </TableCell>
            <TableCell className={`text-center bg-${color}-50`}>
                {getQualitativeGrade(subject.quantitative1)}
            </TableCell>
            {/* ...repite para el resto de parciales, semestres y final */}
            <TableCell className={`text-center font-bold bg-${color}-300`}>
                {final.quantitative}
            </TableCell>
            <TableCell className={`text-center bg-${color}-300`}>
                {final.qualitative}
            </TableCell>
        </>
    )
}
