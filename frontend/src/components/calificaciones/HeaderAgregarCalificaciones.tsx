"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"

interface Props {
    grupoNombre?: string
    anioId?: string | number
    onVolver?: () => void
}

export default function HeaderAgregarCalificaciones({ grupoNombre, anioId, onVolver }: Props) {
    return (
        <div className="mb-8">
            <Button variant="ghost" onClick={onVolver} className="mb-4 -ml-2 hover:bg-muted">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Grupos Asignados
            </Button>

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-foreground">Agregar Calificaciones</h1>
                    <p className="text-muted-foreground text-lg">
                        Grupo {grupoNombre} - Año Escolar {anioId}
                    </p>
                </div>
            </div>
        </div>
    )
}
