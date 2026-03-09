"use client"

import { useEffect, useState } from "react"
import { getEsquelaByGrupo } from "@/actions/calificaciones/esquelasHeadsMethods/esquelasHeadMethods"

export const useEsquelaGrupo = (grupoId: number | undefined) => {

    const [yaTieneEsquela, setYaTieneEsquela] = useState(false)
    const [esquela, setEsquela] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const verificarEsquela = async () => {
        if (!grupoId) return

        try {
            const response = await getEsquelaByGrupo(grupoId)

            setYaTieneEsquela(!!response)
            setEsquela(response)

        } catch {
            setYaTieneEsquela(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        verificarEsquela()
    }, [grupoId])

    return {
        yaTieneEsquela,
        esquela,
        loading,
        refetch: verificarEsquela
    }
}