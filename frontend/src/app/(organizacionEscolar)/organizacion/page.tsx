"use client"
import { getOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import ProtectedRoute from '@/components/hoc/ProtectedRoute';
import AddOrganizacionEscolarModal from '@/components/modals/organizacionEscolar/organizacion/AddOrganizacionEscolarModal';
import SearchBar from '@/components/SearchBar';
import OrganizacionEscolarTable from '@/components/tables/organizacionEscolar/OrganizacionEscolarTable';
import type { OrganizacionEscolar } from '@/interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function OrganizacionEscolar() {
    const [organizacionEscolar, setOrganizacionEscolar] = useState<OrganizacionEscolar[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const organizacionId = searchParams.get("organizacionId");

    const fetchOrganizacionEscolar = async () => {
        try {
            const response = await getOrganizacionEscolar();
            // Si viene con idOrganizacion, filtramos automáticamente
            if (organizacionId) {
                const filtered = response.filter((org: OrganizacionEscolar) => org.id.toString() === organizacionId);
                setOrganizacionEscolar(filtered);
            } else {
                setOrganizacionEscolar(response || []);
            }
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

    //filtro que busca por año lectivo
    const filteredOrganizacionEscolar = organizacionEscolar.filter((u) =>
        String(u.anio_lectivo?.anio_lectivo ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">
                    Gestion de Organzacion Escolar
                </h1>
                <div className="flex justify-end sm:mr-10 mb-6 mt-5">
                    <AddOrganizacionEscolarModal fetchOrganizacionEscolar={fetchOrganizacionEscolar} />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
                <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">
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
    );
}