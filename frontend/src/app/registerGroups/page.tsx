import { getGrupos } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import AddGruposModal from '@/components/modals/organizacionEscolar/gruposEscolares/AddGruposModal';
import NavbarAdmin from '@/components/navbarAdmin';
import SearchBar from '@/components/SearchBar';
import { GrupoEscolar } from '@/interfaces';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

export default function page() {
    const [grupos, setGrupos] = useState<GrupoEscolar[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");

    const router = useRouter();

    const fetchGrupos = async () => {
        try {
            const response = await getGrupos();
            setGrupos(response || [])
        } catch (error: any) {
            if (error.message === "Unauthorized") {
                router.push("/auth/login"); // redirigir en cliente
            } else {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        fetchGrupos();
    }, []);

    //       //filtro que busca por el nombre
    //   const filteredDocentes = grupos.filter((u) =>
    //     u.gradoId.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    return (
        <div className="flex h-screen">
            <div>
                <NavbarAdmin />
            </div>
            <div className="w-screen p-6 bg-gray-100">
                <div className="flex items-center justify-between">
                    <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                        Años Lectivos
                    </h1>
                    <div className="flex justify-end mr-10 mb-6 mt-5">
                        <AddGruposModal fetchGrupos={fetchGrupos} />
                    </div>
                </div>
                <div className="flex items-center justify-between bg-white border rounded-t-xl">
                    <h2 className="pl-10 text-xl font-bold text-gray-600">
                        Listado de Años Lectivos
                    </h2>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm("")}
                        placeholder="Buscar Año lectivo"
                    />
                </div>
                {/* <AnioLectivoTable anioLectivo={filteredAnioLectivo} fetchAniosLectivos={fetchAniosLectivos}/> */}
            </div>
        </div>
    );
}
