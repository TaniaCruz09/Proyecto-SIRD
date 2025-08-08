
import DeleteOrganizacionEscolarModal from '@/components/modals/organizacionEscolar/organizacion/DeleteOrganizacionEscolarModal';
import EditOrganizacionEscolarModal from '@/components/modals/organizacionEscolar/organizacion/EditOrganizacionEscolarModal';
import { OrganizacionEscolar } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaChildren } from 'react-icons/fa6';

interface OrganizacionEscolarRowProps {
    fetchOrganizacionEscolar: () => Promise<void>,
    organizacionEscolar: OrganizacionEscolar,
}

export default function OrganizacionEscolarRow({ fetchOrganizacionEscolar, organizacionEscolar }: OrganizacionEscolarRowProps) {
    const router = useRouter();

    return (
        <tr className="hover:bg-gray-100 cursor-pointer">
            <td className="p-3 border-b border-gray-200">{organizacionEscolar.id}</td>
            <td className="p-3 border-b border-gray-200">{organizacionEscolar.anio_lectivo.anio_lectivo}</td>
            <td className="p-3 border-b border-gray-200">
                {organizacionEscolar.grupo.grado?.grades} -
                {organizacionEscolar.grupo.seccion?.seccion} -
                {organizacionEscolar.grupo.modalidad?.modalidad} -
                {organizacionEscolar.grupo.turno?.turno}
            </td>
            <td className="p-3 border-b border-gray-200">{organizacionEscolar.docenteGuia.nombres}</td>
            <td className="p-3 border-b border-gray-200">
                {organizacionEscolar.docentes.map((d) => d.nombres).join(', ')}
            </td>
            <td className="p-3 border-b border-gray-200">
                {organizacionEscolar.asignaturas.map((a) => a.asignatura).join(', ')}
            </td>
            <td className="p-3 border-b border-gray-200">
                {organizacionEscolar.cortes.map((c) => c.corte).join(', ')}
            </td>
            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><button onClick={() => router.push(`/organizacionEscolar/gruposConEstudiantes?idOrganizacion=${organizacionEscolar.id}&anioLectivo=${organizacionEscolar.anio_lectivo.anio_lectivo}&grupo=${`${organizacionEscolar.grupo.grado?.grades} -
                ${organizacionEscolar.grupo.seccion?.seccion} -
                ${organizacionEscolar.grupo.modalidad?.modalidad} -
                ${organizacionEscolar.grupo.turno?.turno}`}&docenteGuia=${organizacionEscolar.docenteGuia.nombres}`)} className="bg-blue-300/30 hover:bg-blue-400 text-blue-500 text-bold text-xl px-4 py-2 rounded-md text-sm cursor-pointer">
                <FaChildren />
            </button></td>

            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditOrganizacionEscolarModal organizacionEscolar={organizacionEscolar} fetchOrganizacionEscolar={fetchOrganizacionEscolar} /></td>
            <td className="p-3 px-2 py-3 border-b border-gray-200 text-center"><DeleteOrganizacionEscolarModal idEliminar={organizacionEscolar.id} fetchOrganizacionEscolar={fetchOrganizacionEscolar} /></td>
        </tr>
    )
}
