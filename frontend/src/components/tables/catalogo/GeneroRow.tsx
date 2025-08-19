"use client"

import DeleteSexoModal from '@/components/modals/catalogo/generoModals/DeleteGeneroModal';
import EditSexoModal from '@/components/modals/catalogo/generoModals/EditGeneroModal';
import { Sexo } from '@/interfaces';
import React from 'react'

interface GeneroRowProp{
    fetchGenero: ()=> Promise<void>
    genero: Sexo
}

export default function GeneroRow({fetchGenero, genero}:GeneroRowProp) {
  console.log("Generos recibidos:", genero);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{genero.id}</td>
        <td className="p-3 border-b border-gray-200">{genero.gender}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditSexoModal genero={genero} fetchGenero={fetchGenero}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteSexoModal idEliminar={genero.id} fetchGenero={fetchGenero}/></td>
    </tr>
  )
}