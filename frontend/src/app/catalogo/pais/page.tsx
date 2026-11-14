"use client";

import { getPaises } from '@/actions/catalogos/paisMethods';
import AddPaisModal from '@/components/modals/catalogo/paisModals/AddPaisModal';
import SearchBar from '@/components/SearchBar';
import PaisTable from '@/components/tables/catalogo/PaisTable';
import { Pais } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchPaises = async () => {
    try {
      const response = await getPaises();
      setPaises(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchPaises();
  }, []);

  //filtro
  const filteredPais = paises.filter((u) =>
    (u.pais ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">Paises</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddPaisModal fetchPaises={fetchPaises} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de Paises</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Pais"
        />
      </div>
      <PaisTable paises={filteredPais} fetchPaises={fetchPaises} />
    </div>
  )
}
