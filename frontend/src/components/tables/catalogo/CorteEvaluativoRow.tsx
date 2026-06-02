"use client"

import DeleteCorteEvaluativoModal from '@/components/modals/catalogo/corteEvaluativoModals/DeleteCorteEvaluativoModal';
import EditCorteEvaluativoModal from '@/components/modals/catalogo/corteEvaluativoModals/EditCorteEvaluativoModal';
import { Corte } from '@/interfaces';
import React from 'react'

interface CorteEvaluativoRowProp{
    fetchCorteEvaluativo: ()=> Promise<void>
    corteEvaluativo: Corte
}

export default function CorteEvaluativoRow({fetchCorteEvaluativo, corteEvaluativo}:CorteEvaluativoRowProp) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{corteEvaluativo.id}</td>
        <td className="p-3 border-b border-gray-200">{corteEvaluativo.corte}</td>
        <td className="p-3 border-b border-gray-200">{corteEvaluativo.abreviatura}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditCorteEvaluativoModal corteEvaluativo={corteEvaluativo} fetchCortesEvaluativos={fetchCorteEvaluativo}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteCorteEvaluativoModal idEliminar={corteEvaluativo.id} fetchCortesEvaluativos={fetchCorteEvaluativo}/></td>
    </tr>
  )
}