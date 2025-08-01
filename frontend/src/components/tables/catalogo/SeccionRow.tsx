"use client"

import DeleteSeccionModal from '@/components/modals/catalogo/seccionModals/DeleteSeccionModal';
import EditSeccionModal from '@/components/modals/catalogo/seccionModals/EditSeccionModal';
import { Seccion } from '@/interfaces';
import React from 'react'

interface SeccionRowProps {
  fetchSecciones: () => Promise<void>
  seccion: Seccion
}

export default function SeccionRow({ fetchSecciones, seccion }: SeccionRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{seccion.id}</td>
      <td className="p-3 border-b border-gray-200">{seccion.seccion}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditSeccionModal seccion={seccion} fetchSecciones={fetchSecciones} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteSeccionModal idEliminar={seccion.id} fetchSecciones={fetchSecciones} /></td>
    </tr>
  )
}