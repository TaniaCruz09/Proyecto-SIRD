"use client";

import { getNotasCualitativas } from '@/actions/catalogos/notaCualitativaMethods';
import AddNotaCualitativaModal from '@/components/modals/catalogo/notaCualitativaModals/AddNotaCualitativaModal';
import SearchBar from '@/components/SearchBar';
import NotaCualitativaTable from '@/components/tables/catalogo/NotaCualitativaTable';
import { NotaCualitativa } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [notas, setNotas] = useState<NotaCualitativa[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchNotas = async () => {
    try {
      const response = await getNotasCualitativas();
      setNotas(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login");
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchNotas();
  }, []);

  // filtro
  const filteredNotas = notas.filter((u) =>
    (u.nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">Notas Cualitativas</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddNotaCualitativaModal fetchNotas={fetchNotas} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de notas cualitativas</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar nota"
        />
      </div>
      <NotaCualitativaTable notas={filteredNotas} fetchNotas={fetchNotas} />
    </div>
  )
}
