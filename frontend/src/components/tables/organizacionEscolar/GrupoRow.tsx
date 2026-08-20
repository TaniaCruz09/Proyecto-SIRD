import DeleteGruposModal from '@/components/modals/organizacionEscolar/gruposEscolares/DeleteGruposModal';
import EditGrupoModal from '@/components/modals/organizacionEscolar/gruposEscolares/EditGrupoModal';
import { GrupoEscolar } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaChildren } from 'react-icons/fa6';

interface GrupoRowProps {
    fetchGrupos: () => Promise<void>,
    grupo: GrupoEscolar,
    onShowDetail: () => void;
}

export default function GrupoRow({ fetchGrupos, grupo, onShowDetail }: GrupoRowProps) {
    const router = useRouter();

    return (
        <tr className="hover:bg-gray-100 cursor-pointer">
            <td className="p-3 border-b border-gray-200">{grupo.id}</td>
            <td className="p-3 border-b border-gray-200">{grupo.organizacionEscolar?.anio_lectivo?.anio_lectivo || "sin año lectivo"} - {grupo.organizacionEscolar?.turno?.turno || "sin turno"} - {grupo.organizacionEscolar?.turno?.modalidad?.modalidad || "sin modalidad"}
            </td>
            <td className="p-3 border-b border-gray-200">{grupo.grado?.grades ?? "Sin grado"}</td>
            <td className="p-3 border-b border-gray-200">{grupo.seccion?.seccion ?? "Sin sección"}</td>
            <td className="p-3 border-b border-gray-200">{grupo.organizacionEscolar?.turno?.turno ?? "Sin turno"}</td>
            <td className="p-3 border-b border-gray-200">{grupo.docenteGuia ? `${grupo.docenteGuia.nombres} ${grupo.docenteGuia.apellido_paterno} ${grupo.docenteGuia.apellido_materno}` : "Sin docente guía"}</td>
            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditGrupoModal grupo={grupo} fetchGrupos={fetchGrupos} /></td>
            <td className="p-3 px-2 py-3 border-b border-gray-200 text-center"><DeleteGruposModal idEliminar={grupo.id} fetchGrupos={fetchGrupos} /></td>
        </tr>
    )
}
