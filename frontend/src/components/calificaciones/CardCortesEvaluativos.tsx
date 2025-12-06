import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock } from 'lucide-react'
import { getCortesEvaluativos } from '@/actions/catalogos/corteEvaluativoMethods'
import { Corte } from '@/interfaces'
import { CorteUI } from '@/interfaces/calificaciones/AgregarCalificaciones'


interface CardCortesEvaluativosProps {
    estudiantes: any[] // tu tipo Estudiante
    asignaturaActiva: number
    corteActivo: number | null
    setCorteActivo: (c: number) => void
    cortesUI: CorteUI[]
}

export default function CardCortesEvaluativos({
    estudiantes,
    asignaturaActiva,
    corteActivo,
    setCorteActivo,
    cortesUI
}: CardCortesEvaluativosProps) {

    const verificarCorteCompleto = (corteId: number, asignaturaId: number) => {
        return estudiantes.every(est => {
            const calificacion = est.calificaciones[asignaturaId]?.[corteId]
            return typeof calificacion !== "undefined" && calificacion !== ""
        })
    }

    const verificarCorteHabilitado = (index: number, asignaturaId: number) => {
        if (index === 0) return true
        const corteAnterior = cortesUI[index - 1]
        if (!corteAnterior) return false
        return verificarCorteCompleto(corteAnterior.id, asignaturaId)
    }

    return (
        <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
                <CardTitle className="text-xl">Seleccionar Período de Calificación</CardTitle>
                <CardDescription>
                    Los cortes se habilitan progresivamente al completar todas las calificaciones del corte anterior
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cortesUI.map((corte, index) => {
                        const habilitado = verificarCorteHabilitado(index, asignaturaActiva)
                        const completo = verificarCorteCompleto(corte.id, asignaturaActiva)

                        return (
                            <Button
                                key={corte.id}
                                variant={corteActivo === corte.id ? "default" : "outline"}
                                disabled={!habilitado}
                                onClick={() => setCorteActivo(corte.id)}
                                className={`h-auto py-4 flex flex-col items-start gap-2 relative ${corteActivo === corte.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div className={`w-3 h-3 rounded-full ${habilitado ? corte.color : "bg-muted"}`} />
                                    <span className="font-semibold">{corte.corte}</span>
                                    {!habilitado && <Lock className="h-4 w-4 ml-auto" />}
                                    {completo && <CheckCircle className="h-4 w-4 ml-auto text-secondary" />}
                                </div>

                                <span className="text-xs opacity-80">
                                    {!habilitado ? "Bloqueado" : completo ? "Completado" : "En progreso"}
                                </span>
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}