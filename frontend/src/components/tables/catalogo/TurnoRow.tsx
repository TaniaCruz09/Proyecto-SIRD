"use client"
import DeleteTurnoModal from '@/components/modals/catalogo/turnoModals/DeleteTurnoModal';
import EditTurnoModal from '@/components/modals/catalogo/turnoModals/EditTurnoModal';
import { Turno } from '@/interfaces';
import React from 'react'

interface TurnoRowProp{
    fetchTurno: ()=> Promise<void>
    turno: Turno
}

export default function TurnoRow({fetchTurno, turno}:TurnoRowProp) {
  console.log("Turnos recibid0s:", turno);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{turno.id}</td>
        <td className="p-3 border-b border-gray-200">{turno.turno}</td>
        <td className="p-3 border-b border-gray-200">{turno.modalidad?.modalidad || "Sin modalidad"}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditTurnoModal turno={turno} fetchTurno={fetchTurno}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteTurnoModal idEliminar={turno.id} fetchTurno={fetchTurno}/></td>
    </tr>
  )
}