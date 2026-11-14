"use client";

import { getAsignaturas } from "@/actions/catalogos/asignaturaMethods";
import AddAsignaturaModal from "@/components/modals/catalogo/asignaturaModals/AddAsignaturaModal";
import SearchBar from "@/components/SearchBar";
import AsignaturaTable from "@/components/tables/catalogo/AsignaturaTable";
import { Asignatura } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchAsignaturas = async () => {
    try {
      const response = await getAsignaturas();
      setAsignaturas(response);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  //filtro
  const filteredAsignatura = asignaturas.filter((u) =>
    (u.asignatura ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">
          Asignatura
        </h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddAsignaturaModal fetchAsignaturas={fetchAsignaturas} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">
          Listados de Asignatura
        </h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Asignatura"
        />
      </div>
      <AsignaturaTable
        asignatura={filteredAsignatura}
        fetchAsignatura={fetchAsignaturas}
      />
    </div>
  );
}
