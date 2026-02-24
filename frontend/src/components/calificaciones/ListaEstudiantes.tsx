"use client"

import React, { useEffect, useState } from "react"
import EstudianteRow from "./EstudianteRow"
import { getEsquelaRowByEstudianteAndAnio } from "@/actions/calificaciones/esquelasRowsMethods/esquelasRowsMethods"

export default function ListaEstudiantes({
    estudiantes,
    asignatura,
    corteActivo,
    guardando,
    getInitials,
    anioLectivo,
    handleGuardarIndividual,
    isAnioActivo
}: any) {
    const [notasBD, setNotasBD] = useState<{ [estId: number]: any }>({})

    useEffect(() => {
        async function fetchNotas() {
            const allNotas: { [estId: number]: any } = {}
            for (const est of estudiantes) {
                try {
                    const rows = await getEsquelaRowByEstudianteAndAnio(est.id, anioLectivo)
                    allNotas[est.id] = rows // guardar todas las notas por estudiante
                } catch (error) {
                    console.error(`Error al traer notas del estudiante ${est.id}:`, error)
                }
            }
            setNotasBD(allNotas)
        }

        fetchNotas()
    }, [estudiantes, anioLectivo])

    return (
        <div className="space-y-4">
            <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 border-b font-semibold text-sm text-muted-foreground">
                <div className="col-span-1 text-center">Foto</div>
                <div className="col-span-4">Nombre Completo</div>
                <div className="col-span-2">Código</div>
                <div className="col-span-1 text-center">Sexo</div>
                <div className="col-span-4">Calificación</div>
            </div>

            {estudiantes.map((est: any) => (
                <EstudianteRow
                    key={est.id}
                    estudiante={est}
                    asignaturaId={asignatura.id}
                    corteActivo={corteActivo}
                    guardando={guardando}
                    getInitials={getInitials}
                    onGuardar={handleGuardarIndividual}
                    notaBD={notasBD[est.id]?.find(
                        (r: any) =>
                            r?.asignatura?.id === asignatura.id &&
                            r?.corte?.id === corteActivo
                    )}
                    isAnioActivo={isAnioActivo}
                />
            ))}
        </div>
    )
}
