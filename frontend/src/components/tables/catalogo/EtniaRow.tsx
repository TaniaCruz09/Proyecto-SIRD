"use client"

import DeleteEtniaModal from '@/components/modals/catalogo/etniaModals/DeleteEtniaModal';
import EditEtniaModal from '@/components/modals/catalogo/etniaModals/EditEtniaModal';
import { Etnia } from '@/interfaces';
import React from 'react'

interface EtniaRowProps {
  fetchEtnias: () => Promise<void>
  etnia: Etnia
}

export default function EtniaRow({ fetchEtnias, etnia }: EtniaRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{etnia.id}</td>
      <td className="p-3 border-b border-gray-200">{etnia.etnia}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditEtniaModal etnia={etnia} fetchEtnias={fetchEtnias} /></td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteEtniaModal idEliminar={etnia.id} fetchEtnias={fetchEtnias} /></td>
    </tr>
  )
}