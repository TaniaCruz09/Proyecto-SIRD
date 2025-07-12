"use client"

import DeleteSemestreModal from '@/components/modals/catalogo/semestreModals/DeleteSemestreModal';
import EditSemestreModal from '@/components/modals/catalogo/semestreModals/EditSemestreModal';
import { Semestre } from '@/interfaces';
import React from 'react'

interface SemestreRowProp{
    fetchSemestres: ()=> Promise<void>
    semestre: Semestre
}

export default function SemestreRow({fetchSemestres, semestre}:SemestreRowProp) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{semestre.id}</td>
        <td className="p-3 border-b border-gray-200">{semestre.semestre}</td>
        <td className="p-3 border-b border-gray-200">{semestre.abreviatura}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditSemestreModal semestre={semestre} fetchSemestres={fetchSemestres}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteSemestreModal idEliminar={semestre.id} fetchSemestres={fetchSemestres}/></td>
    </tr>
  )
}