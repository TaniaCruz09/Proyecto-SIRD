"use client";

import { Grado } from "@/interfaces";
import React from "react";
import GradoRow from "./GradoRow";

interface GradoProps {
  grado: Grado[];
  fetchGrados: () => Promise<void>;
}

export default function GradoTable({
  grado,
  fetchGrados,
}: GradoProps) {
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Grados</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Editar
              </th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {grado.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-10">
                  No hay Grados registrados.
                </td>
              </tr>
            ) : (
              grado.map((gradoItem) => (
                <GradoRow
                  key={gradoItem.id}
                  fetchGrados={fetchGrados}
                  grado={gradoItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
