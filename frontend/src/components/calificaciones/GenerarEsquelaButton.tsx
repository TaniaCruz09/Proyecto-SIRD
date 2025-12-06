"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { getEsquelaByGrupo, saveEsquelaHead } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"
import { EsquelaHeadInterface } from "@/interfaces/calificaciones/EsquelaHead"

interface GenerarEsquelaButtonProps {
    grupoId: number
}

export default function GenerarEsquelaButton({ grupoId }: GenerarEsquelaButtonProps) {
    const router = useRouter()
    const [yaTieneEsquela, setYaTieneEsquela] = useState(false)
    const [esquela, setEsquela] = useState<EsquelaHeadInterface>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verificarEsquela = async () => {
            try {
                const response = await getEsquelaByGrupo(grupoId)
                setYaTieneEsquela(!!response) // si hay objeto, true; si es null, false
                setEsquela(response)
            } catch (error) {
                setYaTieneEsquela(false)
            } finally {
                setLoading(false)
            }
        }
        verificarEsquela()
    }, [grupoId])

    const handleClick = async () => {
        if (yaTieneEsquela && esquela?.id) {
            router.push(`/esquela-calificaciones/${esquela.id}`)
            return
        }

        try {
            const payload = { grupo_asignatura: { id: grupoId } }
            const response = await saveEsquelaHead(payload)
            if (response && response.id) {
                setEsquela(response)
                setYaTieneEsquela(true)
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-2 flex justify-center items-center gap-2 opacity-80"
            >
                <FileText className="w-4 h-4 animate-pulse" /> Cargando...
            </Button>
        )
    }

    return (
        <Button
            onClick={handleClick}
            className={`w-full rounded-lg py-2 flex justify-center items-center gap-2 transition-all duration-200 ${yaTieneEsquela
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500"
                }`}
        >
            <FileText className="w-4 h-4" />
            {yaTieneEsquela ? "Ver Esquela" : "Generar Esquela"}
        </Button>
    )
}
