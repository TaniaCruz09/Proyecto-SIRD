import { TableCell } from "../ui/table"

interface SubjectProps {
    name: string
    subject: any
    color: string
}

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

function SubjectRow({ name, subject, color }: SubjectProps) {
    const firstSem = calculateFirstSemester(subject)
    const secondSem = calculateSecondSemester(subject)
    const final = calculateSubjectFinal(firstSem.quantitative, secondSem.quantitative)

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
