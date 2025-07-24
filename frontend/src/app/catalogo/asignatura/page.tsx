"use client";

import { getAsignaturas } from "@/actions/catalogos/asignaturaMethods";
import AddAsignaturaModal from "@/components/modals/catalogo/asignaturaModals/AddAsignaturaModal";
import NavbarAdmin from "@/components/navbarAdmin";
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
    u.asignatura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div>
        <NavbarAdmin />
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
            Asignatura
          </h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            <AddAsignaturaModal fetchAsignaturas={fetchAsignaturas}/>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">
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
    </div>
  );
}
