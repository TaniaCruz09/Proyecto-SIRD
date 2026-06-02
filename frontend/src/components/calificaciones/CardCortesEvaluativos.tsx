import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock } from 'lucide-react'
import { CorteUI } from '@/interfaces/calificaciones/AgregarCalificaciones'

type CorteStatus = {
    habilitado: boolean
    completo: boolean
    mensaje: string
    rango: string
}

interface CardCortesEvaluativosProps {
    corteActivo: number | null
    setCorteActivo: (c: number) => void
    cortesUI: CorteUI[]
    tipoPeriodizacion?: string
    getCorteStatus: (corteId: number) => CorteStatus
}

const formatTipoPeriodizacion = (tipo?: string) => {
    const value = (tipo ?? "").trim().toUpperCase()

    switch (value) {
        case "SEMESTRE":
        case "SEMESTRAL":
            return "semestral"
        case "CUATRIMESTRE":
        case "CUATRIMESTRAL":
            return "cuatrimestral"
        case "TRIMESTRE":
        case "TRIMESTRAL":
            return "trimestral"
        case "BIMESTRE":
        case "BIMESTRAL":
            return "bimestral"
        case "PERSONALIZADO":
            return "personalizado"
        default:
            return ""
    }
}

export default function CardCortesEvaluativos({
    corteActivo,
    setCorteActivo,
    cortesUI,
    tipoPeriodizacion,
    getCorteStatus,
}: CardCortesEvaluativosProps) {

    const tipoPeriodizacionLabel = formatTipoPeriodizacion(tipoPeriodizacion)

    return (
        <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
                <CardTitle className="text-xl">
                    {tipoPeriodizacionLabel
                        ? `Período ${tipoPeriodizacionLabel} `
                        : "Seleccionar Período de Calificación"}
                </CardTitle>
                <CardDescription>
                    Los cortes se habilitan por secuencia y por las fechas configuradas en el calendario del año lectivo
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cortesUI.map((corte) => {
                        const { habilitado, completo, mensaje, rango } = getCorteStatus(corte.id)

                        return (
                            <Button
                                key={corte.id}
                                variant={corteActivo === corte.id ? "default" : "outline"}
                                disabled={!habilitado}
                                onClick={() => setCorteActivo(corte.id)}
                                title={mensaje}
                                className={`h-auto py-4 flex flex-col items-start gap-2 relative ${corteActivo === corte.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div className={`w-3 h-3 rounded-full ${habilitado ? corte.color : "bg-muted"}`} />
                                    <span className="font-semibold">{corte.corte}</span>
                                    {!habilitado && <Lock className="h-4 w-4 ml-auto" />}
                                    {completo && <CheckCircle className="h-4 w-4 ml-auto text-secondary" />}
                                </div>

                                <span className="text-xs opacity-80">
                                    {!habilitado ? mensaje : completo ? "Completado" : mensaje}
                                </span>

                                {rango ? <span className="text-[11px] opacity-70">{rango}</span> : null}
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}