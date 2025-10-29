import { OrganizacionEscolar } from '@/interfaces'
import React, { useState } from 'react'
import OrganizacionEscolarRow from './OrganizacionEscolarRow';

interface OrganizacionEscolarTableProps {
    organizacionEscolar: OrganizacionEscolar[];
    fetchOrganizacionEscolar: () => Promise<void>
}

export default function OrganizacionEscolarTable({ organizacionEscolar, fetchOrganizacionEscolar }: OrganizacionEscolarTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const GruposPerPage = 5;

    const indexOfLastGrupo = currentPage * GruposPerPage;
    const indexOfFirstGrupo = indexOfLastGrupo - GruposPerPage;
    const currentDocentes = organizacionEscolar.slice(indexOfFirstGrupo, indexOfLastGrupo);
    return (
        <div className="bg-white">
            <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
                <table className="w-full space-y-2 text-left bg-white text-gray-800">
                    <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
                        <tr>
                            <th className="p-3 border-b border-gray-300">Id</th>
                            <th className="p-3 border-b border-gray-300">Año Lectivo</th>
                            <th className="p-3 border-b border-gray-300">Turno</th>
                            <th className="p-1 border-b border-gray-300 text-center">Grupos</th>
                            <th className="p-1 border-b border-gray-300 text-center">Editar</th>
                            <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-sm">
                        {organizacionEscolar.length > 0 ? (
                            currentDocentes.map((organizacionEscolar) => (
                                <OrganizacionEscolarRow
                                    key={organizacionEscolar.id}
                                    fetchOrganizacionEscolar={fetchOrganizacionEscolar}
                                    organizacionEscolar={organizacionEscolar}

                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-3">
                                    No hay grupos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
                <p>
                    Página {currentPage} de {Math.ceil(organizacionEscolar.length / GruposPerPage)}
                </p>
                <div className="space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                prev < Math.ceil(organizacionEscolar.length / GruposPerPage) ? prev + 1 : prev
                            )
                        }
                        disabled={currentPage === Math.ceil(organizacionEscolar.length / GruposPerPage)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
