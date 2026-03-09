"use client"
import { EsquelaRow } from '@/components/calificaciones/EsquelaRow'
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react'

export default function EsquelaCalificaciones() {
    const { esquelaId } = useParams();
    const searchParams = useSearchParams()

    const estudianteId = searchParams.get("estudianteId")
    return (
        <div>
            <EsquelaRow esquelaHeadId={Number(esquelaId)} estudianteId={Number(estudianteId)} />
        </div>
    )
}