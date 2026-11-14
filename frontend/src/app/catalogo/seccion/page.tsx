"use client";

import { getSecciones } from '@/actions/catalogos/seccionMethods';
import AddSeccionModal from '@/components/modals/catalogo/seccionModals/AddSeccionModal';
import SearchBar from '@/components/SearchBar';
import SeccionTable from '@/components/tables/catalogo/SeccionTable';
import { Seccion } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchSecciones = async () => {
    try {
      const response = await getSecciones();
      setSecciones(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchSecciones();
  }, []);

  //filtro
  const filteredSecciones = secciones.filter((u) =>
    (u.seccion ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">Seciones</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddSeccionModal fetchSecciones={fetchSecciones} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de Secciones</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Seccion"
        />
      </div>
      <SeccionTable seccion={filteredSecciones} fetchSecciones={fetchSecciones} />
    </div>
  )
}
