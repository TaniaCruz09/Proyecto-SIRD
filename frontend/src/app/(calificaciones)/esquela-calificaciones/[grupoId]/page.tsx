"use client"
import { EsquelaRow } from '@/components/calificaciones/EsquelaRow'
import { useParams } from 'next/navigation';
import React from 'react'

export default function EsquelaCalificaciones() {
    const { grupoId } = useParams();
    return (
        <div>
            <EsquelaRow grupoId={Number(grupoId)} />
        </div>
    )
}
