"use client";

import React from "react";
import { TipoPeriodizacion } from "@/interfaces";
import { usePagination } from "@/components/paginacion/usePaginacion";
import Pagination from "@/components/paginacion/paginacion";
import TipoPeriodizacionRow from "./TipoPeriodizacionRow";

interface TipoPeriodizacionTableProps {
  tipoPeriodizacion: TipoPeriodizacion[];
  fetchTiposPeriodizacion: () => Promise<void>;
}

export default function TipoPeriodizacionTable({
  tipoPeriodizacion,
  fetchTiposPeriodizacion,
}: TipoPeriodizacionTableProps) {
  const { currentPage, setCurrentPage, currentItems } = usePagination(tipoPeriodizacion, 5);

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Nombre</th>
              <th className="p-3 border-b border-gray-300">Periodos</th>
              <th className="p-3 border-b border-gray-300">Prefijo</th>
              <th className="p-3 border-b border-gray-300">Estado</th>
              <th className="p-1 border-b border-gray-300 text-center">Editar</th>
              <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {tipoPeriodizacion.length > 0 ? (
              currentItems.map((item) => (
                <TipoPeriodizacionRow
                  key={item.id}
                  tipoPeriodizacion={item}
                  fetchTiposPeriodizacion={fetchTiposPeriodizacion}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-10">
                  No hay tipos de periodo registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={tipoPeriodizacion.length}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
