"use client"

import EditDocenteModal from '../modals/docentes/EditDocenteModal'
import DeleteDocenteModal from '../modals/docentes/DeleteDocenteModal'
import { Docente } from '@/interfaces'
import { TbEyePlus } from 'react-icons/tb'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useRef, useState } from 'react'
import Link from 'next/link'

interface DocenteRowProps {
  fetchDocentes: () => Promise<void>
  docente: Docente
}

export default function DocenteRow({ fetchDocentes, docente }: DocenteRowProps) {

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_API_UPLOADS}${path}`;
  };

  console.log("Imagen:", getImageUrl(docente.foto_docente));

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{docente.id}</td>
      <td className="p-3 border-b border-gray-200 cursor-pointer">
        <Avatar className="w-10 h-10 border-2 border-green-200">
          {docente.foto_docente ? (
            <AvatarImage
              src={getImageUrl(docente.foto_docente) || "/placeholder.svg"}
              alt={docente.nombres}
              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
            />
          ) : (

            <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
              {`${docente.nombres.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 1)}${docente.apellido_paterno.split("")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 1)}`}
            </AvatarFallback>
          )}
        </Avatar>
      </td>
      <td className="p-3 border-b border-gray-200">{docente.nombres}</td>
      <td className="p-3 border-b border-gray-200">{docente.apellido_paterno}  {docente.apellido_materno}</td>
      <td className="p-3 border-b border-gray-200">{docente.telefono}</td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <Link
          href={`/docente/expedienteDocente/${docente.id}`}
          className="inline-flex items-center justify-center bg-blue-300/30 hover:bg-blue-400 text-blue-600 font-bold text-xl px-4 py-2 rounded-md cursor-pointer transition"
        >
          <TbEyePlus />
        </Link>
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditDocenteModal docente={docente} fetchDocentes={fetchDocentes} /></td>
      <td className="p-3 px-2 py-3 border-b border-gray-200 text-center"><DeleteDocenteModal idEliminar={docente.id} docenteFullName={`${docente.nombres} ${docente.apellido_paterno} ${docente.apellido_materno}`.trim()} fetchDocentes={fetchDocentes} /></td>
    </tr>
  )
}
