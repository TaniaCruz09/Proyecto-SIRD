"use client";

import { getCortesEvaluativos } from "@/actions/catalogos/corteEvaluativoMethods";
import AddCorteEvaluativoModal from "@/components/modals/catalogo/corteEvaluativoModals/AddCorteEvaluativoModal";
import SearchBar from "@/components/SearchBar";
import CorteEvaluativoTable from "@/components/tables/catalogo/CorteEvaluativoTable";
import { Corte } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [cortesEvaluativos, setCortesEvaluativos] = useState<Corte[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const fetchCortesEvaluativos = async () => {
    try {
      const response = await getCortesEvaluativos();
      const ordered = (response || []).slice().sort((a: Corte, b: Corte) => (a.id ?? 0) - (b.id ?? 0));
      setCortesEvaluativos(ordered);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login"); // redirigir en cliente
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchCortesEvaluativos();
  }, []);

  //filtro
  const filteredCorteEvaluativo = cortesEvaluativos.filter((u) =>
    (u.corte ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:ml-10 font-bold mb-4 tracking-tight text-gray-600 text-center">
          Cortes Evaluativos
        </h1>
        <div className="flex justify-end sm:mr-10 mb-6 mt-5"><AddCorteEvaluativoModal fetchCortesEvaluativos={fetchCortesEvaluativos} /></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border bg-white">
        <h2 className="pl-4 text-xl sm:pl-10 font-bold text-gray-600">
          Listado de Cortes Evaluativos
        </h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Corte Evaluativo"
        />
      </div>
      <CorteEvaluativoTable
        corteEvaluativo={filteredCorteEvaluativo}
        fetchCortesEvaluativos={fetchCortesEvaluativos}
      />
    </div>
  );
}
