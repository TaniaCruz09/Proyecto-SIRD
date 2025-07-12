"use client"

import DeleteAsignaturaModal from '@/components/modals/catalogo/asignaturaModals/DeleteAsignaturaModal';
import EditAsignaturaModal from '@/components/modals/catalogo/asignaturaModals/EditAsignaturaModal';
import { Asignatura } from '@/interfaces';
import React from 'react'

interface AsignaturaRowProp{
    fetchAsignatura: ()=> Promise<void>
    asignatura: Asignatura
}

export default function AsignaturaRow({fetchAsignatura, asignatura}:AsignaturaRowProp) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{asignatura.id}</td>
        <td className="p-3 border-b border-gray-200">{asignatura.asignatura}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditAsignaturaModal asignatura={asignatura} fetchAsignatura={fetchAsignatura}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteAsignaturaModal idEliminar={asignatura.id} fetchAsignaturas={fetchAsignatura}/></td>
    </tr>
  )
}