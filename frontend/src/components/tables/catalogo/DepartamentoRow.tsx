"use client"

import DeleteDepartamentoModal from '@/components/modals/catalogo/departamentoModals/DeleteDepartamentoModal';
import EditDepartamentoModal from '@/components/modals/catalogo/departamentoModals/EditDepartamentoModal';
import { Departamento } from '@/interfaces';
import React from 'react'

interface ModalidadRowProp{
    fetchDepartamentos: ()=> Promise<void>
    departamento: Departamento
}

export default function DepartamentoRow({fetchDepartamentos, departamento}:ModalidadRowProp) {
  console.log("Modalidades recibidas:", departamento);
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{departamento.id}</td>
        <td className="p-3 border-b border-gray-200">{departamento.departamento}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditDepartamentoModal departamento={departamento} fetchDepartamentos={fetchDepartamentos}/></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><DeleteDepartamentoModal idEliminar={departamento.id} fetchDepartamento={fetchDepartamentos}/></td>
    </tr>
  )
}