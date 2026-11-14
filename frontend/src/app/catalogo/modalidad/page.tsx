"use client";

import { getModalidades } from "@/actions/catalogos/modalidadMethods";
import AddModalidadModal from "@/components/modals/catalogo/modalidad/AddModalidadModal";
import SearchBar from "@/components/SearchBar";
import ModalidadTable from "@/components/tables/catalogo/ModalidadTable";
import { Modalidad } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchModalidades = async () => {
    try {
      const response = await getModalidades();
      setModalidades(response || []);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchModalidades();
  }, []);

  //filtro
  const filteredModalidad = modalidades.filter((u) =>
    (u.modalidad ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">
          Modalidades
        </h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5">
          <AddModalidadModal fetchModalidades={fetchModalidades} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">
          Listado de Modalidades
        </h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Modalidad"
        />
      </div>
      <ModalidadTable
        modalidad={filteredModalidad}
        fetchModalidades={fetchModalidades}
      />
    </div>
  );
}
