"use client";

import React from "react";
import NotaCualitativaRow from "./NotaCualitativaRow";
import { NotaCualitativa } from "@/interfaces";
import { usePagination } from "@/components/paginacion/usePaginacion";
import Pagination from "@/components/paginacion/paginacion";

interface NotaCualitativaProp {
  notas: NotaCualitativa[];
  fetchNotas: () => Promise<void>;
}

export default function NotaCualitativaTable({
  notas,
  fetchNotas,
}: NotaCualitativaProp) {
  const {
    currentPage,
    setCurrentPage,
    currentItems,
  } = usePagination(notas, 5);

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Nombre</th>
              <th className="p-3 border-b border-gray-300">Abreviatura</th>
              <th className="p-3 border-b border-gray-300 text-center">Rango menor</th>
              <th className="p-3 border-b border-gray-300 text-center">Rango mayor</th>
              <th className="p-1 border-b border-gray-300 text-center">Editar</th>
              <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {notas.length > 0 ? (
              currentItems.map((item) => (
                <NotaCualitativaRow
                  key={item.id}
                  fetchNotas={fetchNotas}
                  nota={item}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-10">
                  No hay notas cualitativas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={notas.length}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
