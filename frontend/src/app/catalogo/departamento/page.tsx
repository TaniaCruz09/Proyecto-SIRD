"use client";

import { getDepartamentos } from "@/actions/catalogos/departamentoMethods";
import AddDepartamentoModal from "@/components/modals/catalogo/departamentoModals/AddDepartamentoModal";
import SearchBar from "@/components/SearchBar";
import DepartamentoTable from "@/components/tables/catalogo/DepartamentoTable";
import { Departamento } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchDepartamento = async () => {
    try {
      const response = await getDepartamentos();
      setDepartamentos(response);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchDepartamento();
  }, []);

  //filtro
  const filteredDepartamento = departamentos.filter((u) =>
    (u.departamento ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">
          Departamentos
        </h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5"><AddDepartamentoModal fetchDepartamento={fetchDepartamento} /></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">
          Listado de departamentos
        </h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Departamento"
        />
      </div>
      <DepartamentoTable
        departamento={filteredDepartamento}
        fetchDepartamentos={fetchDepartamento}
      />
    </div>
  );
}
