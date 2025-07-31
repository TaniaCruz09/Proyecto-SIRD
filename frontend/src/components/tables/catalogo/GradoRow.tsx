"use client"

import DeleteGradosModal from '@/components/modals/catalogo/gradosModals/DeleteGradosModal';
import EditGradosModal from '@/components/modals/catalogo/gradosModals/EditGradosModal';
import { Grado } from '@/interfaces';
import React from 'react'

interface GradoRowProps {
  fetchGrados: () => Promise<void>
  grado: Grado
}

export default function GradoRow({ fetchGrados, grado }: GradoRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{grado.id}</td>
      <td className="p-3 border-b border-gray-200">{grado.grades}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditGradosModal grado={grado} fetchGrados={fetchGrados} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteGradosModal idEliminar={grado.id} fetchGrados={fetchGrados} /></td>
    </tr>
  )
}