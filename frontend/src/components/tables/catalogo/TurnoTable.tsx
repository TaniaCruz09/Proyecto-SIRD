"use client";

import React from "react";
import TurnoRow from "./TurnoRow";
import { Turno } from "@/interfaces";

interface TurnoProp {
  turno: Turno[];
  fetchTurno: () => Promise<void>;
}

export default function TurnoTable({
  turno,
  fetchTurno,
}: TurnoProp) {
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Turno</th>
              <th className="p-3 border-b border-gray-300">Modalidades</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Editar
              </th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {turno.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-10">
                  No hay turnos registradas.
                </td>
              </tr>
            ) : (
              turno.map((TurnoItem) => (
                <TurnoRow
                  key={TurnoItem.id}
                  fetchTurno={fetchTurno}
                  turno={TurnoItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
