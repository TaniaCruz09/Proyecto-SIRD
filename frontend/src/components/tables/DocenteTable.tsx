"use client";

import React, { useState } from "react";

import { Docente } from "@/interfaces";
import ModalDetalleDocente from "../modals/docentes/ModalDetalleDocente";
import DocenteRow from "./DocenteRow";

interface DocenteTableProps {
  docentes: Docente[];
  fetchDocentes: () => Promise<void>;
}

export default function DocenteTable({
  docentes,
  fetchDocentes,
}: DocenteTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [docenteDetalle, setDocenteDetalle] = useState<Docente | null>(null);
  const DocentesPerPage = 5;

  const indexOfLastDocente = currentPage * DocentesPerPage;
  const indexOfFirstDocente = indexOfLastDocente - DocentesPerPage;
  const currentDocentes = docentes.slice(indexOfFirstDocente, indexOfLastDocente);

  return (
    <div className="bg-white">
    <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
      <table className="w-full space-y-2 text-left bg-white text-gray-800">
        <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
          <tr>
            <th className="p-3 border-b border-gray-300">Id</th>
            <th className="p-3 border-b border-gray-300">Nombres</th>
            <th className="p-3 border-b border-gray-300">Apellido 1</th>
            <th className="p-3 border-b border-gray-300">Apellido 2</th>
            <th className="p-3 border-b border-gray-300">Teléfono</th>
            <th className="p-1 border-b border-gray-300 text-center">Mas Informacion</th>
            <th className="p-1 border-b border-gray-300 text-center">Editar</th>
            <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
          </tr>
        </thead>
        <tbody className="text-black text-sm">
          {docentes.length > 0 ? (
            currentDocentes.map((docente) => (
              <DocenteRow
              key={docente.id}
              fetchDocentes={fetchDocentes}
              docente={docente}
              onShowDetail={()=> setDocenteDetalle(docente)} //para ver mas detalles
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-3">
                No hay docentes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

      {/* Paginación */}
      <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
        <p>
          Página {currentPage} de {Math.ceil(docentes.length / DocentesPerPage)}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(docentes.length / DocentesPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage === Math.ceil(docentes.length / DocentesPerPage)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal detalle docente */}
      <ModalDetalleDocente
        docente={docenteDetalle}
        onClose={() => setDocenteDetalle(null)}
      />
    </div>
  );
}
