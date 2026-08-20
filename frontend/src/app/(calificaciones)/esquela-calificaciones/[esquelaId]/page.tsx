"use client"
import { EsquelaRow } from '@/components/calificaciones/EsquelaRow'
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import React from 'react'

export default function EsquelaCalificaciones() {
    const { esquelaId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const estudianteId = searchParams.get("estudianteId")
    return (
        <div>
            <button
                onClick={() => router.back()}
                style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    color: "#000",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginLeft: "10px",
                    marginTop: "10px"
                }}
            >
                ← Regresar
            </button>
            <EsquelaRow esquelaHeadId={Number(esquelaId)} estudianteId={Number(estudianteId)} />
        </div>
    )
}