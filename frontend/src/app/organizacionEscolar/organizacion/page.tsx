"use client"

import { getOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import AddGruposModal from '@/components/modals/organizacionEscolar/gruposEscolares/AddGruposModal';
import NavbarAdmin from '@/components/navbarAdmin';
import SearchBar from '@/components/SearchBar';
import GrupoTable from '@/components/tables/organizacionEscolar/GrupoTable';
import { OrganizacionEscolar } from '@/interfaces';
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
    const filteredGrupo = organizacionEscolar.filter((u) =>
        u.anio_lectivo.anio_lectivo.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="flex h-screen">
            <div>
                <NavbarAdmin />
            </div>
            <div className="w-screen p-6 bg-gray-100">
                <div className="flex items-center justify-between">
                    <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                        Gestion de Grupos Academicos
                    </h1>
                    <div className="flex justify-end mr-10 mb-6 mt-5">
                        <AddGruposModal fetchGrupos={fetchOrganizacionEscolar} />
                    </div>
                </div>
                <div className="flex items-center justify-between bg-white border rounded-t-xl">
                    <h2 className="pl-10 text-xl font-bold text-gray-600">
                        Listado de grupos Academicos
                    </h2>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm("")}
                        placeholder="Buscar Año lectivo"
                    />
                </div>
                <GrupoTable grupos={filteredGrupo} fetchGrupos={fetchOrganizacionEscolar} />
            </div>
        </div>
    );
}
