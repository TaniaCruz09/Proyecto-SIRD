"use client";

import { getTurnos } from '@/actions/catalogos/turnoMethods';
import AddTurnoModal from '@/components/modals/catalogo/turnoModals/AddTurnoModal';
import SearchBar from '@/components/SearchBar';
import TurnoTable from '@/components/tables/catalogo/TurnoTable';
import { Turno } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchTurnos = async () => {
    try {
      const response = await getTurnos();
      setTurnos(response)
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchTurnos();
  }, []);

  //filtro
  const filteredTurno = turnos.filter((u) =>
    (u.turno ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-6">
      <div className="flex items-center justify-between">
        <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">Turnos</h1>
        <div className="flex justify-end mr-10 mb-6 mt-5">
          <AddTurnoModal fetchTurno={fetchTurnos} />
        </div>
      </div>
      <div className="flex items-center justify-between bg-white border rounded-t-xl">
        <h2 className="pl-10 text-xl font-bold text-gray-600">Listados de turnos</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar turno"
        />
      </div>
      <TurnoTable turno={filteredTurno} fetchTurno={fetchTurnos} />
    </div>
  )
}
