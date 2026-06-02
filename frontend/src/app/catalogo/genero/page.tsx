"use client";

import { getSexos } from '@/actions/catalogos/sexoMethods';
import AddSexoModal from '@/components/modals/catalogo/generoModals/AddgeneroModal';
import SearchBar from '@/components/SearchBar';
import GenterTable from '@/components/tables/catalogo/GeneroTable';
import { Sexo } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [sexos, setSexos] = useState<Sexo[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchSexos = async () => {
    try {
      const response = await getSexos();
      setSexos(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchSexos();
  }, []);

  //filtro
  const filteredSexo = sexos.filter((u) =>
    (u.gender ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-6">
      <div className="flex items-center justify-between">
        <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">Sexos</h1>
        <div className="flex justify-end mr-10 mb-6 mt-5">
          <div className="flex justify-end mr-10 mb-6 mt-5">
            <AddSexoModal fetchGeneros={fetchSexos} /></div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white border rounded-t-xl">
        <h2 className="pl-10 text-xl font-bold text-gray-600">Listado de Sexos</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Sexo"
        />
      </div>
      <GenterTable
        genter={filteredSexo}
        fetchGeneros={fetchSexos}
      />
    </div>
  )
}
