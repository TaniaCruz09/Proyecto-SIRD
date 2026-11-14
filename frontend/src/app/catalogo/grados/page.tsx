"use client";

import { getGrados } from '@/actions/catalogos/gradoMethods';
import AddGradosModal from '@/components/modals/catalogo/gradosModals/AddGradosModal';
import SearchBar from '@/components/SearchBar';
import GradoTable from '@/components/tables/catalogo/GradoTable';
import { Grado } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [grados, setGrados] = useState<Grado[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchGrados = async () => {
    try {
      const response = await getGrados();
      setGrados(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchGrados();
  }, []);

  //filtro
  const filteredGrado = grados.filter((u) =>
    (u.grades ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">Grados</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddGradosModal fetchGrados={fetchGrados} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de Grados</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Grado"
        />
      </div>
      <GradoTable grado={filteredGrado} fetchGrados={fetchGrados} />
    </div>
  )
}
