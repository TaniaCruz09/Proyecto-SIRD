"use client";

import { getAniosLectivos } from "@/actions/catalogos/anioLectivoMethods";
import AddAniosLectivosModal from "@/components/modals/catalogo/anioLectivoModals/AddAnioLectivoModal";
import NavbarAdmin from "@/components/navbarAdmin";
import SearchBar from "@/components/SearchBar";
import AnioLectivoTable from "@/components/tables/catalogo/AnioLectivoTable";
import { AnioLectivo } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [anioLectivos, setAniosLectivos] = useState<AnioLectivo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchAniosLectivos = async () => {
    try {
      const response = await getAniosLectivos();
      setAniosLectivos(response);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchAniosLectivos();
  }, []);

  //filtro
  const filteredAnioLectivo = anioLectivos.filter((u) => u.anio_lectivo);

  return (
    <div className="flex h-screen">
      <div>
        <NavbarAdmin />
      </div>
      <div className="p-6 bg-gray-100 w-full h-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
            Años Lectivos 
          </h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            <AddAniosLectivosModal fetchAniosLectivos={fetchAniosLectivos} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">
            Listado de Años Lectivos
          </h2>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Buscar Año lectivo"
          />
        </div>
        <AnioLectivoTable anioLectivo={filteredAnioLectivo} fetchAniosLectivos={fetchAniosLectivos}/>
      </div>
    </div>
  );
}
