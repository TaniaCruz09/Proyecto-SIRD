"use client"

import DeleteAñoLectivoModal from '@/components/modals/catalogo/anioLectivoModals/DeleteAnioLectivoModal';
import EditAñoLectivoModal from '@/components/modals/catalogo/anioLectivoModals/EditAnioLectivoModal';
import { AnioLectivo } from '@/interfaces';
import React from 'react'

interface AnioLectivoRowProp {
  fetchAniosLectivos: () => Promise<void>
  anioLectivo: AnioLectivo
}

export default function AnioLectivoRow({ fetchAniosLectivos, anioLectivo }: AnioLectivoRowProp) {
  const cortes =
    anioLectivo.cortes ??
    anioLectivo.cortesAnioLectivo?.map((item) => item.corte) ??
    []

  const periodosLabel =
    anioLectivo.periodos?.length
      ? anioLectivo.periodos
        .slice()
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        .map((periodo) => {
          const cortesPeriodo = periodo.cortes
            .map((corte) => corte.abreviatura || corte.corte)
            .join(", ")
          return `${periodo.nombre}: ${cortesPeriodo || "Sin cortes"}`
        })
        .join(" | ")
      : null

  const cortesLabel =
    periodosLabel ??
    (cortes.length > 0
      ? cortes.map((corte) => corte.abreviatura || corte.corte).join(", ")
      : "Sin cortes")

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{anioLectivo.id}</td>
      <td className="p-3 border-b border-gray-200">{anioLectivo.anio_lectivo}</td>
      <td className="p-3 border-b border-gray-200">{cortesLabel}</td>
      <td className="p-3 border-b border-gray-200">
        <span
          className={`px-2 py-1 font-medium ${anioLectivo.isActive ? "text-green-500" : "text-red-500"
            }`}
        >
          {anioLectivo.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditAñoLectivoModal añoLectivo={anioLectivo} fetchAñoLectivo={fetchAniosLectivos} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteAñoLectivoModal idEliminar={anioLectivo.id} fetchAñoLectivo={fetchAniosLectivos} /></td>
    </tr>
  )
}