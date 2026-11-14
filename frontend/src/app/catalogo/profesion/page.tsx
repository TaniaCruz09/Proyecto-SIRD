"use client";

import { getProfesiones } from '@/actions/catalogos/profesionMethods';
import AddProfesionModal from '@/components/modals/catalogo/profesionModals/AddProfesionModal';
import SearchBar from '@/components/SearchBar';
import ProfesionTable from '@/components/tables/catalogo/ProfesionTable';
import { Profesion } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [profesiones, setProfesiones] = useState<Profesion[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchProfesiones = async () => {
    try {
      const response = await getProfesiones();
      setProfesiones(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchProfesiones();
  }, []);

  //filtro
  const filteredProfesion = profesiones.filter((u) =>
    (u.profession ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">Profesiones</h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddProfesionModal fetchProfesiones={fetchProfesiones} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">Listado de Profesiones</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Profesion"
        />
      </div>
      <ProfesionTable profesion={filteredProfesion} fetchProfesiones={fetchProfesiones} />
    </div>
  )
}
