"use client";
import React, { useState } from "react";

import RolRow from "./RolRow";
import { Role } from "@/interfaces/authInterface";

interface RolTableProps {
  roles: Role[];
  onDelete: (id: number) => void;
  onSuccess?: () => void;
  fetchRoles: () => Promise<void>;
}

export default function RolTable({
  roles,
  onDelete,
  onSuccess,
  fetchRoles,
}: RolTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 5; // o 10, depende del tamaño que quieras

  const indexOfLastRol = currentPage * rolesPerPage;
  const indexOfFirstRol = indexOfLastRol - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRol, indexOfLastRol);

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-250px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-sm font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">ID</th>
              <th className="p-3 border-b border-gray-300">Rol</th>
              <th className="p-3 border-b border-gray-300">Activo</th>
              <th className="p-1 border-b border-gray-300 text-center">Editar</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>

          <tbody className="text-black text-sm">
            {roles.length > 0 ? (
              currentRoles.map((rol) => (
                <RolRow
                  key={rol.id}
                  rol={rol}
                  onDelete={onDelete}
                  onSuccess={() => onSuccess}
                  fetchRoles={fetchRoles}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3">
                  No hay Roles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Mostrando {indexOfFirstRol + 1} -{" "}
          {Math.min(indexOfLastRol, roles.length)} de {roles.length} usuarios
        </p>

        <div className="space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 disabled:opacity-50 text-gray-900"
          >
            Anterior
          </button>
          <button
            disabled={indexOfLastRol >= roles.length}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-2 py-1 bg-gray-400 rounded hover:bg-gray-500 disabled:opacity-50 text-gray-900"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
