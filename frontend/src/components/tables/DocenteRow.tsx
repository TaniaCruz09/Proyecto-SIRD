"use client"

import EditDocenteModal from '../modals/docentes/EditDocenteModal'
import DeleteDocenteModal from '../modals/docentes/DeleteDocenteModal'
import { Docente } from '@/interfaces'
import { TbEyePlus } from 'react-icons/tb'

interface DocenteRowProps {
  fetchDocentes: ()=> Promise<void>
  docente: Docente
  onShowDetail: () => void;
}

export default function DocenteRow({fetchDocentes, docente, onShowDetail}: DocenteRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3 border-b border-gray-200">{docente.id}</td>
        <td className="p-3 border-b border-gray-200">{docente.nombres}</td>
        <td className="p-3 border-b border-gray-200">{docente.apellido_paterno}  {docente.apellido_materno}</td>
        <td className="p-3 border-b border-gray-200">{docente.telefono}</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
          <button onClick={(e) => {
            e.stopPropagation();
            onShowDetail();
          }} className="bg-blue-300/30 hover:bg-blue-400 text-blue-600 text-bold text-xl px-4 py-2 rounded-md text-sm cursor-pointer"> 
          <TbEyePlus/>
          </button>
        </td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditDocenteModal docente={docente} fetchDocentes={fetchDocentes}/></td>
        <td className="p-3 px-2 py-3 border-b border-gray-200 text-center"><DeleteDocenteModal idEliminar={docente.id} fetchDocentes={fetchDocentes}/></td>
    </tr>
  )
}
