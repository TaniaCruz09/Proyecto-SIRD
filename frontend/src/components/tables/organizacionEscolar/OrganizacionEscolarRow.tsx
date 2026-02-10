
import DeleteOrganizacionEscolarModal from '@/components/modals/organizacionEscolar/organizacion/DeleteOrganizacionEscolarModal';
import EditOrganizacionEscolarModal from '@/components/modals/organizacionEscolar/organizacion/EditOrganizacionEscolarModal';
import { OrganizacionEscolar } from '@/interfaces';
import { Users } from 'lucide-react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaChildren } from 'react-icons/fa6';
import { Button } from "@/components/ui/button"

interface OrganizacionEscolarRowProps {
    fetchOrganizacionEscolar: () => Promise<void>,
    organizacionEscolar: OrganizacionEscolar,
}

export default function OrganizacionEscolarRow({ fetchOrganizacionEscolar, organizacionEscolar }: OrganizacionEscolarRowProps) {
    const router = useRouter();

    return (
        <tr className="hover:bg-gray-100 cursor-pointer">
            <td className="p-3 border-b border-gray-200">{organizacionEscolar.id}</td>
            <td className="p-3 border-b border-gray-200">{organizacionEscolar.anio_lectivo?.anio_lectivo || "sin año lectivo"}</td>
            <td className="p-3 border-b border-gray-200">
                {organizacionEscolar.turno.turno}
            </td>
            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-300/30 hover:bg-blue-400 text-blue-500 text-bold text-xl mx-6 py-2 rounded-md text-sm cursor-pointer"
                    onClick={() => router.push(`/add-groups-to-organization/${organizacionEscolar.id}`)}
                >
                    <Users className="h-4 w-4" />
                </Button>
            </td>

            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center"><EditOrganizacionEscolarModal organizacionEscolar={organizacionEscolar} fetchOrganizacionEscolar={fetchOrganizacionEscolar} /></td>
            <td className="p-3 px-2 py-3 border-b border-gray-200 text-center"><DeleteOrganizacionEscolarModal idEliminar={organizacionEscolar.id} fetchOrganizacionEscolar={fetchOrganizacionEscolar} /></td>
        </tr>
    )
}
