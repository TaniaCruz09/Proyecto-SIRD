"use client"

import { getGrupos } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import AddGruposModal from '@/components/modals/organizacionEscolar/gruposEscolares/AddGruposModal';
import FiltroGrupos from '@/components/Filtros/FiltroGrupos';
import GrupoTable from '@/components/tables/organizacionEscolar/GrupoTable';
import { GrupoEscolar } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
    const [grupos, setGrupos] = useState<GrupoEscolar[]>([])
    const [selectedAnio, setSelectedAnio] = useState<string>("");
    const [selectedModalidad, setSelectedModalidad] = useState<string>("");
    const [selectedGrado, setSelectedGrado] = useState<string>("");

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

    const filteredGrupo = grupos.filter((grupo) => {
        const anioLectivo = String(grupo.organizacionEscolar?.anio_lectivo?.anio_lectivo ?? "")
        const modalidad = grupo.turno?.modalidad?.modalidad ?? ""
        const grado = grupo.grado?.grades ?? ""

        const matchAnio = !selectedAnio || anioLectivo === selectedAnio
        const matchModalidad = !selectedModalidad || modalidad === selectedModalidad
        const matchGrado = !selectedGrado || grado === selectedGrado

        return matchAnio && matchModalidad && matchGrado
    })

    return (
        <div className="mx-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-slate-700 text-center">
                    Gestion de Grupos Academicos
                </h1>
                <div className="flex justify-end mr-10 mb-6 mt-5">
                    <AddGruposModal fetchGrupos={fetchGrupos} />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50 px-6 py-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Listado de grupos academicos
                        </h2>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {filteredGrupo.length} resultado(s)
                    </span>
                </div>

                <div className="px-3 py-3 md:px-6">
                    <FiltroGrupos
                        grupos={grupos}
                        selectedAnio={selectedAnio}
                        selectedModalidad={selectedModalidad}
                        selectedGrado={selectedGrado}
                        onChangeAnio={setSelectedAnio}
                        onChangeModalidad={setSelectedModalidad}
                        onChangeGrado={setSelectedGrado}
                        onClear={() => {
                            setSelectedAnio("")
                            setSelectedModalidad("")
                            setSelectedGrado("")
                        }}
                    />
                </div>
            </div>

            <GrupoTable grupos={filteredGrupo} fetchGrupos={fetchGrupos} />
        </div>
    );
}