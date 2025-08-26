"use client"
import { getOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import ProtectedRoute from '@/components/hoc/ProtectedRoute';
import AddOrganizacionEscolarModal from '@/components/modals/organizacionEscolar/organizacion/AddOrganizacionEscolarModal';
import SearchBar from '@/components/SearchBar';
import OrganizacionEscolarTable from '@/components/tables/organizacionEscolar/OrganizacionEscolarTable';
import type { OrganizacionEscolar } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function OrganizacionEscolar() {
    const [organizacionEscolar, setOrganizacionEscolar] = useState<OrganizacionEscolar[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");

    const router = useRouter();

    const fetchOrganizacionEscolar = async () => {
        try {
            const response = await getOrganizacionEscolar();
            setOrganizacionEscolar(response || [])
        } catch (error: any) {
            if (error.message === "Unauthorized") {
                router.push("/auth/login"); // redirigir en cliente
            } else {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        fetchOrganizacionEscolar();
    }, []);

    //filtro que busca por el nombre
    const filteredOrganizacionEscolar = organizacionEscolar.filter((u) =>
        u.turno.turno.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <ProtectedRoute allowedRoles={['Admin']}>
        <div>
            <div className="flex items-center justify-between">
                <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                    Gestion de Organzacion Escolar
                </h1>
                <div className="flex justify-end mr-10 mb-6 mt-5">
                    <AddOrganizacionEscolarModal fetchOrganizacionEscolar={fetchOrganizacionEscolar} />
                </div>
            </div>
            <div className="flex items-center justify-between bg-white border rounded-t-xl">
                <h2 className="pl-10 text-xl font-bold text-gray-600">
                    Listado de organizacion Escolar
                </h2>
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                    placeholder="Buscar por año lectivo"
                />
            </div>
            <OrganizacionEscolarTable organizacionEscolar={filteredOrganizacionEscolar} fetchOrganizacionEscolar={fetchOrganizacionEscolar} />
        </div>
        </ProtectedRoute>
    );
}