"use client";

import { getDocentes } from "@/actions/docentesMethods/docentesMethods";
import AddDocenteModal from "@/components/modals/docentes/AddDocenteModal";
import SearchBar from "@/components/SearchBar";
import DocenteTable from "@/components/tables/DocenteTable";
import { Docente } from "@/interfaces";
import { useEffect, useState } from "react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [docentes, setDocentes] = useState<Docente[]>([]);

  const fetchDocentes = async () => {
    try {
      const response = await getDocentes();
      setDocentes(response || []);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  //filtro que busca por el nombre
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredDocentes = docentes.filter((u) => {
    if (!normalizedSearch) return true;
    const fullName = `${u.nombres ?? ""} ${u.apellido_paterno ?? ""} ${u.apellido_materno ?? ""}`
      .toLowerCase()
      .trim();
    return fullName.includes(normalizedSearch);
  });

  return (
    <div className="mx-6">
      <div className="flex items-center justify-between">
        <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
          Docentes
        </h1>
        <div className="flex justify-end mr-10 mb-6 mt-5">
          <AddDocenteModal fetchDocentes={fetchDocentes} />
        </div>
      </div>
      <div className="flex items-center justify-between bg-white border rounded-t-xl">
        <h2 className="pl-10 text-xl font-bold text-gray-600">
          Listado de docentes
        </h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar docente"
        />
      </div>
      <DocenteTable
        docentes={filteredDocentes}
        fetchDocentes={fetchDocentes}
      />
    </div>
  );
}
