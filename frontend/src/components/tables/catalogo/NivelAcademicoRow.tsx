"use client"

import DeleteNivelAcademicoModal from '@/components/modals/catalogo/nivelAcademicoModals/DeleteNivelAcademicoModal';
import EditNivelAcademicoModal from '@/components/modals/catalogo/nivelAcademicoModals/EditNivelAcademicoModal';
import { NivelAcademico } from '@/interfaces';
import React from 'react'

interface NivelAcademicoRowProps {
  fetchNivelesAcademicos: () => Promise<void>
  nivelAcademico: NivelAcademico
}

export default function NivelAcademicoRow({ fetchNivelesAcademicos, nivelAcademico }: NivelAcademicoRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{nivelAcademico.id}</td>
      <td className="p-3 border-b border-gray-200">{nivelAcademico.academicLevel}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditNivelAcademicoModal nivelAcademico={nivelAcademico} fetchNivelesAcademicos={fetchNivelesAcademicos} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteNivelAcademicoModal idEliminar={nivelAcademico.id} fetchNivelesAcademicos={fetchNivelesAcademicos} /></td>
    </tr>
  )
}