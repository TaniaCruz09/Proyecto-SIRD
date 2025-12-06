"use client"
import { EsquelaRow } from '@/components/calificaciones/EsquelaRow'
import { useParams } from 'next/navigation';
import React from 'react'

export default function EsquelaCalificaciones() {
    const { esquelaId } = useParams();
    return (
        <div>
            <EsquelaRow esquelaHeadId={Number(esquelaId)} />
        </div>
    )
}


// "use client"
// import { ParcialButtons } from "@/components/Buttons/ParcialButtons"
// import { EsquelaTable } from "@/components/calificaciones/EsquelaTable"
// import React from "react"

// interface PageProps {
//     params: { id: string }
// }

// export default function EsquelaPage({ params }: PageProps) {
//     const esquelaId = Number(params.id)

//     return (
//         <div>
//             {/* Botones para parciales */}
//             <ParcialButtons esquelaId={esquelaId} />

//             {/* Vista completa */}
//             <EsquelaTable esquelaHeadId={Number(esquelaId)} />
//         </div>
//     )
// }
