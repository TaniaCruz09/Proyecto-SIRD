"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"

interface Props {
    grupoNombre?: string
    anioId?: string | number
    modalidad?: string
    onVolver?: () => void
}

export default function HeaderAgregarCalificaciones({ grupoNombre, anioId, modalidad, onVolver }: Props) {
    return (
        <div className="mb-8">
            <div className="flex justify-start">
                <Button variant="outline" onClick={onVolver} className="bg-white mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            <div className="flex gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0 self-start">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="text-left">
                    <h1 className="text-4xl font-bold text-foreground">Agregar Calificaciones</h1>
                    <p className="text-muted-foreground text-lg">
                        Grupo {grupoNombre} - Año Escolar {anioId}
                    </p>
                    {modalidad && (
                        <span className="mt-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-full inline-block">
                            {modalidad}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
