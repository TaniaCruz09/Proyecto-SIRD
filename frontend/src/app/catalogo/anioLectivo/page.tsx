"use client";
import { getAniosLectivos } from "@/actions/catalogos/anioLectivoMethods";
import AddAniosLectivosModal from "@/components/modals/catalogo/anioLectivoModals/AddAnioLectivoModal";
import SearchBar from "@/components/SearchBar";
import AnioLectivoTable from "@/components/tables/catalogo/AnioLectivoTable";
import { AnioLectivo } from "@/interfaces";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [anioLectivos, setAniosLectivos] = useState<AnioLectivo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const idAnioLectivo = searchParams.get("idAnioLectivo");

  const fetchAniosLectivos = async () => {
    try {
      const response = await getAniosLectivos();
      if (idAnioLectivo) {
        const filtered = response.filter((anio: AnioLectivo) => anio.id.toString() === idAnioLectivo);
        setAniosLectivos(filtered)
      } else {
        setAniosLectivos(response || []);
      }
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
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredAnioLectivo = anioLectivos.filter((anio) => {
    if (!anio.anio_lectivo) return false;
    if (!normalizedSearch) return true;
    const anioText = anio.anio_lectivo.toString().toLowerCase();
    const idText = anio.id?.toString().toLowerCase() ?? "";
    return anioText.includes(normalizedSearch) || idText.includes(normalizedSearch);
  });

  return (
    <div className="mx-6">
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
      <AnioLectivoTable anioLectivo={filteredAnioLectivo} fetchAniosLectivos={fetchAniosLectivos} />
    </div>
  );
}
