"use client"

import DeleteModalidadModal from '@/components/modals/catalogo/modalidad/DeleteModalidadModal';
import EditModalidadModal from '@/components/modals/catalogo/modalidad/EditModalidadModal';
import { Modalidad } from '@/interfaces';
import React from 'react'

interface ModalidadRowProp{
    fetchModalidad: ()=> Promise<void>
    modalidad: Modalidad
}

export default function ModalidadRow({fetchModalidad, modalidad}:ModalidadRowProp) {
  console.log("Modalidades recibidas:", modalidad);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{modalidad.id}</td>
        <td className="p-3 border-b border-gray-200">{modalidad.modalidad}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditModalidadModal modalidad={modalidad} fetchModalidad={fetchModalidad}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteModalidadModal idEliminar={modalidad.id} fetchModalidades={fetchModalidad}/></td>
    </tr>
  )
}