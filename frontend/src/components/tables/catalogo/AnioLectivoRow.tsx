"use client"

import DeleteAñoLectivoModal from '@/components/modals/catalogo/anioLectivoModals/DeleteAnioLectivoModal';
import EditAñoLectivoModal from '@/components/modals/catalogo/anioLectivoModals/EditAnioLectivoModal';
import { AnioLectivo } from '@/interfaces';
import React from 'react'

interface AnioLectivoRowProp{
    fetchAniosLectivos: ()=> Promise<void>
    anioLectivo: AnioLectivo
}

export default function AnioLectivoRow({fetchAniosLectivos, anioLectivo}:AnioLectivoRowProp) {
  console.log("Año lectivo recibidas:", anioLectivo);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{anioLectivo.id}</td>
        <td className="p-3 border-b border-gray-200">{anioLectivo.anio_lectivo}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditAñoLectivoModal añoLectivo={anioLectivo} fetchAñoLectivo={fetchAniosLectivos}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteAñoLectivoModal idEliminar={anioLectivo.id} fetchAñoLectivo={fetchAniosLectivos}/></td>
    </tr>
  )
}