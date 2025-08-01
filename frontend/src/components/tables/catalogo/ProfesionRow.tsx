"use client"

import DeleteProfesionModal from '@/components/modals/catalogo/profesionModals/DeleteProfesionModal';
import EditProfesionModal from '@/components/modals/catalogo/profesionModals/EditProfesionModal';
import { Profesion } from '@/interfaces';
import React from 'react'

interface ProfesionRowProps {
  fetchProfesiones: () => Promise<void>
  profesion: Profesion
}

export default function ProfesionRow({ fetchProfesiones, profesion }: ProfesionRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{profesion.id}</td>
      <td className="p-3 border-b border-gray-200">{profesion.profession}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditProfesionModal profesion={profesion} fetchProfesiones={fetchProfesiones} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteProfesionModal idEliminar={profesion.id} fetchProfesiones={fetchProfesiones} /></td>
    </tr>
  )
}