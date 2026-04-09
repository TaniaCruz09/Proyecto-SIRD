"use client";

import { getTiposPeriodizacion } from "@/actions/catalogos/tipoPeriodizacionMethods";
import AddTipoPeriodizacionModal from "@/components/modals/catalogo/tipoPeriodizacionModals/AddTipoPeriodizacionModal";
import SearchBar from "@/components/SearchBar";
import TipoPeriodizacionTable from "@/components/tables/catalogo/TipoPeriodizacionTable";
import { TipoPeriodizacion } from "@/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [tiposPeriodizacion, setTiposPeriodizacion] = useState<TipoPeriodizacion[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const fetchTiposPeriodizacion = async () => {
    try {
      const response = await getTiposPeriodizacion();
      const ordered = (response || [])
        .slice()
        .sort((a: TipoPeriodizacion, b: TipoPeriodizacion) => (a.id ?? 0) - (b.id ?? 0));
      setTiposPeriodizacion(ordered);
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        router.push("/auth/login");
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchTiposPeriodizacion();
  }, []);

  const filteredTipos = tiposPeriodizacion.filter((item) => {
    const value = searchTerm.toLowerCase();
    return (
      item.codigo.toLowerCase().includes(value) ||
      item.nombre.toLowerCase().includes(value) ||
      (item.etiqueta_periodo || "").toLowerCase().includes(value)
    );
  });

  return (
    <div className="mx-6">
      <div className="flex items-center justify-between">
        <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
          Tipos de Periodo
        </h1>
        <div className="flex justify-end mr-10 mb-6 mt-5">
          <AddTipoPeriodizacionModal fetchTiposPeriodizacion={fetchTiposPeriodizacion} />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border rounded-t-xl">
        <h2 className="pl-10 text-xl font-bold text-gray-600">Listado de Tipos de Periodos</h2>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Buscar Tipo de Periodo"
        />
      </div>

      <TipoPeriodizacionTable
        tipoPeriodizacion={filteredTipos}
        fetchTiposPeriodizacion={fetchTiposPeriodizacion}
      />
    </div>
  );
}
