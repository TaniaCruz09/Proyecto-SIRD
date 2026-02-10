"use client";

import { Etnia } from "@/interfaces";
import React from "react";
import EtniaRow from "./EtniaRow";
import { usePagination } from "@/components/paginacion/usePaginacion";
import Pagination from "@/components/paginacion/paginacion";

interface EtniaTableProps {
  etnias: Etnia[];
  fetchEtnias: () => Promise<void>;
}

export default function EtniaTable({
  etnias,
  fetchEtnias,
}: EtniaTableProps) {
  const {
    currentPage,
    setCurrentPage,
    currentItems,
  } = usePagination(etnias, 5);
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Etnias</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Editar
              </th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {etnias.length > 0 ? (
              currentItems.map((etniaItem) => (
                <EtniaRow
                  key={etniaItem.id}
                  fetchEtnias={fetchEtnias}
                  etnia={etniaItem}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-10">
                  No hay etnias registradas.
                </td>
              </tr>

            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={etnias.length}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
