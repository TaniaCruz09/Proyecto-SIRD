"use client"

import DeleteCentroEducativoModal from '@/components/modals/catalogo/centroEducativoModals/DeleteCentroModals';
import EditCentroEducativoModal from '@/components/modals/catalogo/centroEducativoModals/EditCentroModals';
import { CentroEscolar } from '@/interfaces/centroInterface';
import React from 'react'
import { TbEyePlus } from 'react-icons/tb';

interface centrosRowProps {
  fetchCentros: () => Promise<void>
  centros: CentroEscolar
  onShowDetail: () => void;
}

export default function CentrosRow({ fetchCentros, centros, onShowDetail}: centrosRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{centros.id}</td>
      <td className="p-3 border-b border-gray-200">{centros.nombreCentro}</td>
      <td className="p-3 border-b border-gray-200">{centros.codigoEstablecimiento}</td>
      <td className="p-3 border-b border-gray-200">{centros.codigoCentro}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
              <button onClick={(e) => {
                e.stopPropagation();
                onShowDetail();
              }} className="bg-blue-300/30 hover:bg-blue-400 text-blue-600 text-bold text-xl px-4 py-2 rounded-md text-sm cursor-pointer">
                <TbEyePlus />
              </button>
            </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditCentroEducativoModal CentroEducativo={centros} fetchCentroEducativo={fetchCentros} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteCentroEducativoModal idEliminar={centros.id} fetchCentroEducativo={fetchCentros} /></td>
    </tr>
  )
}