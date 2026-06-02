"use client"
import React from "react"
import { useParams } from "next/navigation"
import { EsquelaTable } from "@/components/calificaciones/EsquelaTable";
import { ParcialButtons } from "@/components/Buttons/ParcialButtons";

export default function EsquelaCortePage() {
    const params = useParams<{ id: string; corte: string }>()
    const esquelaId = Number(params.id)
    const corte = params.corte as "1" | "2" | "1S" | "3" | "4" | "2S" | "F"

    return (
        <div>
            {/* Botones para cambiar vista */}
            <ParcialButtons esquelaId={esquelaId} />

            {/* Vista filtrada por corte */}
            <EsquelaTable esquelaHeadId={esquelaId} corteFilter={corte} />
        </div>
    )
}
