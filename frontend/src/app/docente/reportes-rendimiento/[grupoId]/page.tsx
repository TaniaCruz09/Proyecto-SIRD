"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

const grados = ["1°", "2°", "3°", "4°", "5°", "6°"]

function EmptyCells({ count, className = "" }: { count: number; className?: string }) {
    return (
        <>
            {Array.from({ length: count }, (_, index) => (
                <td key={index} className={`h-8 border border-slate-950 ${className}`} />
            ))}
        </>
    )
}

export default function ReporteRendimiento() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-slate-100 px-3 py-5 print:bg-white print:p-0">
            <div className="mx-auto mb-4 flex max-w-[1450px] items-center justify-between print:hidden">
                <Button variant="outline" onClick={() => router.back()} className="bg-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Regresar
                </Button>
                <Button onClick={() => window.print()} className="bg-slate-800 text-white hover:bg-slate-700">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
            </div>

            <main className="mx-auto max-w-[1450px] overflow-x-auto bg-white p-3 print:max-w-none print:overflow-visible print:p-0">
                <div className="min-w-[1180px]">
                    <header className="relative border-b-2 border-slate-300 pb-3 text-slate-950">
                        <div className="absolute left-0 top-0 h-20 w-24">
                            <Image
                                src="/logo_actual_instituto_ruben_dario.png"
                                alt="Instituto Rubén Darío"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="pt-1 text-center">
                            <p className="text-sm font-bold">Gobierno de Reconciliación</p>
                            <p className="text-sm font-bold">y Unidad Nacional</p>
                            <p className="mt-1 text-xl font-black">MINISTERIO DE EDUCACIÓN</p>
                        </div>
                        <div className="absolute right-0 top-4 text-right">
                            <p className="text-sm font-bold">Instituto Nacional</p>
                            <p className="text-sm font-bold">&quot;Rubén Darío&quot;</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-[1fr_1fr_1fr] gap-8 py-3 text-xs font-bold uppercase">
                        <div className="space-y-2">
                            <p>Nombre del centro escolar: <span className="inline-block min-w-40 border-b border-slate-950" /></p>
                            <p>Código de establecimiento: <span className="inline-block min-w-36 border-b border-slate-950" /></p>
                            <p>Turno: <span className="inline-block min-w-52 border-b border-slate-950" /></p>
                        </div>
                        <div className="space-y-2">
                            <p>Matrícula actual: AS <span className="inline-block min-w-12 border-b border-slate-950" /> F <span className="inline-block min-w-12 border-b border-slate-950" /></p>
                            <p>Código de centro: <span className="inline-block min-w-52 border-b border-slate-950" /></p>
                        </div>
                        <div className="text-right">
                            <p>Año lectivo: <span className="inline-block min-w-24 border-b border-slate-950" /></p>
                            <p className="mt-2">Modalidad: <span className="inline-block min-w-48 border-b border-slate-950" /></p>
                        </div>
                    </section>

                    <section>
                        <table className="w-full table-fixed border-collapse text-[9px] font-bold">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="w-16 border-2 border-slate-950 px-1 text-center">Grado</th>
                                    <th colSpan={10} className="h-9 border-2 border-slate-950 text-center text-base">Rendimiento Académico General</th>
                                    <th colSpan={2} className="w-28 border-2 border-slate-950 text-center">Matemática</th>
                                    <th colSpan={2} className="w-28 border-2 border-slate-950 text-center">Lengua y Literatura</th>
                                    <th colSpan={2} className="w-28 border-2 border-slate-950 text-center">T.A.C</th>
                                    <th colSpan={2} className="w-28 border-2 border-slate-950 text-center">C y V</th>
                                    <th colSpan={2} className="w-28 border-2 border-slate-950 text-center">A.E.P</th>
                                    <th colSpan={2} className="w-28 border-2 border-slate-950 text-center">Conociendo mi Mundo</th>
                                </tr>
                                <tr>
                                    <th className="border border-slate-950 px-1">MAT.<br />Inicial</th>
                                    <th className="border border-slate-950 px-1">MAT.<br />Actual</th>
                                    <th className="border border-slate-950 px-1">Aprob.<br />UMP</th>
                                    <th className="border border-slate-950 px-1">Aplaz.<br />1 a 2</th>
                                    <th className="border border-slate-950 px-1">Aplaz. 3<br />o +</th>
                                    <th className="border border-slate-950 px-1">% de<br />Retención</th>
                                    <th className="border border-slate-950 px-1">% de<br />Aprob.</th>
                                    <th className="border border-slate-950 px-1">AS</th>
                                    <th className="border border-slate-950 px-1">F</th>
                                    <th className="border border-slate-950 px-1">% Aprob.</th>
                                    <th className="border border-slate-950 px-1">Aprobados</th>
                                    <th className="border border-slate-950 px-1">Reprobados</th>
                                    <th className="border border-slate-950 px-1">Aprobados</th>
                                    <th className="border border-slate-950 px-1">Reprobados</th>
                                    <th className="border border-slate-950 px-1">Aprobados</th>
                                    <th className="border border-slate-950 px-1">Reprobados</th>
                                    <th className="border border-slate-950 px-1">Aprobados</th>
                                    <th className="border border-slate-950 px-1">Reprobados</th>
                                    <th className="border border-slate-950 px-1">Aprobados</th>
                                    <th className="border border-slate-950 px-1">Reprobados</th>
                                    <th className="border border-slate-950 px-1">Aprobados</th>
                                    <th className="border border-slate-950 px-1">Reprobados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grados.map((grado) => (
                                    <tr key={grado}>
                                        <td className="h-8 border-2 border-slate-950 text-center">{grado}</td>
                                        <EmptyCells count={23} />
                                    </tr>
                                ))}
                                <tr>
                                    <td className="h-9 border-2 border-slate-950 text-center">TOTAL</td>
                                    <EmptyCells count={23} />
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="mt-5">
                        <table className="w-[58%] table-fixed border-collapse text-[9px] font-bold">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="w-12 border-2 border-slate-950">Grado</th>
                                    <th colSpan={2} className="border-2 border-slate-950">Inglés</th>
                                    <th colSpan={2} className="border-2 border-slate-950">E.F.P.D</th>
                                    <th colSpan={2} className="border-2 border-slate-950">Ciencias Naturales</th>
                                    <th colSpan={2} className="border-2 border-slate-950">Estudios Sociales</th>
                                    <th colSpan={2} className="border-2 border-slate-950">Derecho y Dignidad de la Mujer</th>
                                </tr>
                                <tr>
                                    {["Inglés", "E.F.P.D", "Ciencias Naturales", "Estudios Sociales", "Derecho y Dignidad de la Mujer"].flatMap((subject) => [
                                        <th key={`${subject}-aprobados`} className="border border-slate-950">Aprobados</th>,
                                        <th key={`${subject}-reprobados`} className="border border-slate-950">Reprobados</th>,
                                    ])}
                                </tr>
                            </thead>
                            <tbody>
                                {grados.map((grado) => (
                                    <tr key={`subject-${grado}`}>
                                        <td className="h-8 border-2 border-slate-950 text-center">{grado}</td>
                                        <EmptyCells count={10} />
                                    </tr>
                                ))}
                                <tr>
                                    <td className="h-9 border-2 border-slate-950 text-center">TOTAL</td>
                                    <EmptyCells count={10} />
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    )
}
