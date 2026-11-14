"use client";

import { getCentros } from '@/actions/centroMethods/centroEducativoMethods';
import AddCentroEducativoModal from '@/components/modals/catalogo/centroEducativoModals/AddCentroModals';
import AddEtniaModal from '@/components/modals/catalogo/etniaModals/AddEtniaModal';
import SearchBar from '@/components/SearchBar';
import CentroTable from '@/components/tables/catalogo/CentroTable';
import { CentroEscolar } from '@/interfaces/centroInterface';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [centroEducativo, setCentroEducativo] = useState<CentroEscolar[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchCentroEducativo = async () => {
    try {
      const response = await getCentros();
      setCentroEducativo(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchCentroEducativo();
  }, []);

  //filtro
  const filteredCentro = centroEducativo.filter((u) =>
    (u.nombreCentro ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">CentroEducativo</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddCentroEducativoModal fetchCentroEducativo={fetchCentroEducativo} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de CentroEducativo</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Centro"
        />
      </div>
      <CentroTable centro={filteredCentro} fetchCentro={fetchCentroEducativo} />
    </div>
  )
}
