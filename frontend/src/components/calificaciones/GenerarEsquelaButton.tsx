"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { getEsquelaByGrupo, saveEsquelaHead } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"
import { useEsquelaGrupo } from "@/hooks/useEsquelaGrupo"

interface GenerarEsquelaButtonProps {
    grupoId: number
}

export default function GenerarEsquelaButton({ grupoId }: GenerarEsquelaButtonProps) {
    const router = useRouter()

    const { yaTieneEsquela, esquela, loading, refetch } = useEsquelaGrupo(grupoId)

    const handleClick = async () => {
        if (yaTieneEsquela && esquela?.id) {
            router.push(`/esquela-calificaciones/${esquela.id}`)
            return
        }

        try {
            const payload = { grupo_asignatura: { id: grupoId } }
            const response = await saveEsquelaHead(payload)
            if (response && response.id) {
                await refetch()
                router.push(`/esquela-calificaciones/${response.id}`)
            }
        } catch (error) {
            console.error("Error generando esquela:", error)
        }
    }

    if (loading) {
        return (
            <Button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-white opacity-80"
            >
                <FileText className="w-4 h-4 animate-pulse" /> Cargando...
            </Button>
        )
    }

    return (
        <Button
            onClick={handleClick}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 transition-all duration-200 ${yaTieneEsquela
                ? "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
        >
            <FileText className="w-4 h-4" />
            {yaTieneEsquela ? "Ver Esquela" : "Generar Esquela"}
        </Button>
    )
}
