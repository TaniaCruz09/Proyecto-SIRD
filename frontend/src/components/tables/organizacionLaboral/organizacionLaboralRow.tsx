"use client"
import DeleteOrganizacionLaboralModal from '@/components/modals/organizacionLaboral/DeleteOrganizacionLaboral'
import EditOrganizacionLaboralModal from '@/components/modals/organizacionLaboral/EditOrganizacionLaboral'
import { OrganizacionLaboral } from '@/interfaces/organizacionLaboralInterface'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { TbEyePlus } from 'react-icons/tb'

interface OrganizacionLaboralRowProps {
  fetchorganizacionLaboral: () => Promise<void>
  organizacionLaboral: OrganizacionLaboral
  onShowDetail: () => void;
  onOpenFormAsignaturas: (id: number) => void;  
}

export default function OrganizacionLaboralRow({ fetchorganizacionLaboral, organizacionLaboral, onShowDetail, onOpenFormAsignaturas}: OrganizacionLaboralRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{organizacionLaboral.id}</td>
      <td className="p-3 border-b border-gray-200">{organizacionLaboral.docente.nombres}</td>
      <td className="p-3 border-b border-gray-200">{organizacionLaboral.añolectivo?.anio_lectivo}</td>
      <td className="p-3 border-b border-gray-200">
        {organizacionLaboral.grupoGuia
          ? `${organizacionLaboral.grupoGuia.grado?.grades ?? ''} - ${organizacionLaboral.grupoGuia.modalidad?.modalidad ?? ''} - ${organizacionLaboral.grupoGuia.turno?.turno ?? ''}`
          : '—'}
      </td>
      <td className="p-3 border-b border-gray-200">
        <h3>aca estaran</h3>
      </td>
      
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <button onClick={(e) => {
          e.stopPropagation();
          onOpenFormAsignaturas(organizacionLaboral.id!);  // abrir formulario para easignar grupos y materias
        }} className="bg-blue-300/30 hover:bg-blue-400 text-blue-600 text-bold text-xl px-4 py-2 rounded-md text-sm cursor-pointer">
          <IoMdAddCircleOutline />
        </button>
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <button onClick={(e) => {
          e.stopPropagation();
          onShowDetail();
        }} className="bg-blue-300/30 hover:bg-blue-400 text-blue-600 text-bold text-xl px-4 py-2 rounded-md text-sm cursor-pointer">
          <TbEyePlus />
        </button>
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditOrganizacionLaboralModal organizacionLaboral={organizacionLaboral} fetchOrganizacionLaboral={fetchorganizacionLaboral} /></td>
      <td className="p-3 px-2 py-3 border-b border-gray-200 text-center"><DeleteOrganizacionLaboralModal idEliminar={organizacionLaboral.id!} fetchOrganizacionLaboral={fetchorganizacionLaboral} /></td>
    </tr>
  )
}
