"use client"
import DeleteNotaCualitativaModal from '@/components/modals/catalogo/notaCualitativaModals/DeleteNotaCualitativaModal';
import EditNotaCualitativaModal from '@/components/modals/catalogo/notaCualitativaModals/EditNotaCualitativaModal';
import { NotaCualitativa } from '@/interfaces';
import React from 'react'

interface NotaCualitativaRowProp{
    fetchNotas: ()=> Promise<void>
    nota: NotaCualitativa
}

export default function NotaCualitativaRow({fetchNotas, nota}: NotaCualitativaRowProp) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{nota.id}</td>
        <td className="p-3 border-b border-gray-200">{nota.nombre}</td>
        <td className="p-3 border-b border-gray-200">{nota.abreviatura}</td>
        <td className="p-3 border-b border-gray-200 text-center">{nota.rango_menor}</td>
        <td className="p-3 border-b border-gray-200 text-center">{nota.rango_mayor}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
          <EditNotaCualitativaModal nota={nota} fetchNotas={fetchNotas} />
        </td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
          <DeleteNotaCualitativaModal idEliminar={nota.id!} fetchNotas={fetchNotas} />
        </td>
    </tr>
  )
}
