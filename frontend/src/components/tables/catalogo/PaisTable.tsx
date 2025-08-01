"use client";

import { Pais } from "@/interfaces";
import React from "react";
import PaisRow from "./PaisRow";

interface PaisProp {
  paises: Pais[];
  fetchPaises: () => Promise<void>;
}

export default function PaisTable({
  paises,
  fetchPaises,
}: PaisProp) {
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Paises</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Editar
              </th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {paises.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-10">
                  No hay Paises registradas.
                </td>
              </tr>
            ) : (
              paises.map((paisItem) => (
                <PaisRow
                  key={paisItem.id}
                  fetchPaises={fetchPaises}
                  pais={paisItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
