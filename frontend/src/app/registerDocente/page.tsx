"use client";

import getDocentes from "@/actions/docentesMethods/docentesMethods";
import AddDocenteModal from "@/components/modals/docentes/AddDocenteModal";
import NavbarAdmin from "@/components/navbarAdmin";
import SearchBar from "@/components/SearchBar";
import DocenteTable from "@/components/tables/DocenteTable";
import { Docente } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [docentes, setDocentes] = useState<Docente[]>([]);

  const router = useRouter();

  const fetchDocentes = async () => {
    try {
      const response = await getDocentes();
      setDocentes(response || []);
    } catch (error: any) {
      // console.error("Error al obtener Docentes", error);
      if (error.message === "Unauthorized") {
          router.push("/auth/login"); // redirigir en cliente
        } else {
          console.error(error);
        }
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  //filtro que busca por el nombre
  const filteredDocentes = docentes.filter((u) =>
    u.nombres.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen ">
      <div>
        <NavbarAdmin />
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
            Docentes
          </h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            <AddDocenteModal fetchDocentes={fetchDocentes}/>
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
    </div>
  );
}
