"use client"
import React from "react"
import { EsquelaTable } from "@/components/calificaciones/EsquelaTable";
import { ParcialButtons } from "@/components/Buttons/ParcialButtons";

interface PageProps {
    params: { id: string; corte: string }
}

export default function EsquelaCortePage({ params }: PageProps) {
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
