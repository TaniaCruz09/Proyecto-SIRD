"use client";

import { AnioLectivo } from "@/interfaces";
import React from "react";
import ModalidadRow from "./ModalidadRow";
import AnioLectivoRow from "./AnioLectivoRow";

interface AnioLectivoProp {
  anioLectivo: AnioLectivo[];
  fetchAniosLectivos: () => Promise<void>;
}

export default function AnioLectivoTable({
  anioLectivo,
  fetchAniosLectivos,
}: AnioLectivoProp) {
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Años Lectivos</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Editar
              </th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {anioLectivo.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-10">
                  No hay Años Lectivos registradas.
                </td>
              </tr>
            ) : (
              anioLectivo.map((anioLectivoItem) => (
                <AnioLectivoRow
                  key={anioLectivoItem.id}
                  fetchAniosLectivos={fetchAniosLectivos}
                  anioLectivo={anioLectivoItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
