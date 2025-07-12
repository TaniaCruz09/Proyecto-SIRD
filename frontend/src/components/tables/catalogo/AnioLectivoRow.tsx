"use client"

import { AnioLectivo, Modalidad } from '@/interfaces';
import React from 'react'

interface AnioLectivoRowProp{
    fetchAniosLectivos: ()=> Promise<void>
    anioLectivo: AnioLectivo
}

export default function AnioLectivoRow({fetchAniosLectivos, anioLectivo}:AnioLectivoRowProp) {
  console.log("Modalidades recibidas:", anioLectivo);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{anioLectivo.id}</td>
        <td className="p-3 border-b border-gray-200">{anioLectivo.anioLectivo}</td>
        {/* <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditModalidadModal modalidad={anioLectivo} fetchModalidad={fetchAnioLectivos}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteModalidadModal idEliminar={anioLectivo.id} fetchModalidades={fetchAnioLectivos}/></td> */}
    </tr>
  )
}