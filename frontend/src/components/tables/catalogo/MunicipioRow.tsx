"use client"

import DeleteMunicipioModal from '@/components/modals/catalogo/municipioModals/DeleteMunicipioModal';
import EditMunicipioModal from '@/components/modals/catalogo/municipioModals/EditMunicipioModal';
import { Municipio } from '@/interfaces';
import React from 'react'

interface MunicipioRowProp{
    fetchMunicipio: ()=> Promise<void>
    municipio: Municipio
}

export default function MunicipioRow({fetchMunicipio, municipio}:MunicipioRowProp) {
  console.log("Municipios recibidos:", municipio);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{municipio.id}</td>
        <td className="p-3 border-b border-gray-200">{municipio.municipio}</td>
        <td className="p-3 border-b border-gray-200">{municipio.departamento?.departamento || "Sin departamento"}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditMunicipioModal municipio={municipio} fetchMunicipio={fetchMunicipio}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteMunicipioModal idEliminar={municipio.id} fetchMunicipios={fetchMunicipio}/></td>
    </tr>
  )
}