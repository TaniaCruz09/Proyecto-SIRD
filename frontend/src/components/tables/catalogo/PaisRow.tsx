"use client"

import DeletePaisModal from '@/components/modals/catalogo/paisModals/DeletePaisModal';
import EditPaisModal from '@/components/modals/catalogo/paisModals/EditPaisModal';
import { Pais } from '@/interfaces';
import React from 'react'

interface PaisRowProps {
  fetchPaises: () => Promise<void>
  pais: Pais
}

export default function PaisRow({ fetchPaises, pais }: PaisRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{pais.id}</td>
      <td className="p-3 border-b border-gray-200">{pais.pais}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditPaisModal pais={pais} fetchPaises={fetchPaises} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeletePaisModal idEliminar={pais.id} fetchPaises={fetchPaises} /></td>
    </tr>
  )
}