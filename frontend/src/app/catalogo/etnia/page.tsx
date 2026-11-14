"use client";

import { getEtnias } from '@/actions/catalogos/etniaMethods';
import AddEtniaModal from '@/components/modals/catalogo/etniaModals/AddEtniaModal';
import SearchBar from '@/components/SearchBar';
import EtniaTable from '@/components/tables/catalogo/EtniaTable';
import { Etnia } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [etnias, setEtnias] = useState<Etnia[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchEtnia = async () => {
    try {
      const response = await getEtnias();
      setEtnias(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchEtnia();
  }, []);

  //filtro
  const filteredEtnia = etnias.filter((u) =>
    (u.etnia ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">Etnias</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddEtniaModal fetchEtnias={fetchEtnia} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de Etnias</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Etnia"
        />
      </div>
      <EtniaTable etnias={filteredEtnia} fetchEtnias={fetchEtnia} />
    </div>
  )
}
