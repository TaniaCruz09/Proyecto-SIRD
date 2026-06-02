"use client";
import { CentroEscolar } from "@/interfaces/centroInterface";
import React, { useState } from "react";
import CentrosRow from "./centroRow";
import ModalDetallecentro from "@/components/modals/catalogo/centroEducativoModals/ModalDeatalleCentro";

interface CentroTableProps {
  centro: CentroEscolar[];
  fetchCentro: () => Promise<void>;
}

export default function CentroTable({
  centro,
  fetchCentro,
}: CentroTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [centroDetalle, setCentroDetalle] = useState<CentroEscolar | null>(null);
  const CentroPerPage = 5;

  const indexOfLastCentro = currentPage * CentroPerPage;
  const indexOfFirstCentro = indexOfLastCentro - CentroPerPage;
  const currentCentro = centro.slice(indexOfFirstCentro, indexOfLastCentro);

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">centro</th>
              <th className="p-3 border-b border-gray-300">codigo del establecimiento</th>
              <th className="p-3 border-b border-gray-300">codigo del centro</th>
              <th className="p-1 border-b border-gray-300 text-center">Mas Informacion</th>
              <th className="p-1 border-b border-gray-300 text-center">
                Editar
              </th>
              <th className="p-1 border-b border-gray-300 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="text-black text-sm">
            {centro.length > 0 ? (
              currentCentro.map((centro) => (
                <CentrosRow
                  key={centro.id}
                  fetchCentros={fetchCentro}
                  centros={centro}
                  onShowDetail={() => setCentroDetalle(centro)}
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
          Página {currentPage} de {Math.ceil(centro.length / CentroPerPage)}
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
                prev < Math.ceil(centro.length / CentroPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage === Math.ceil(centro.length / CentroPerPage)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
      {/* Modal detalle docente */}
      <ModalDetallecentro
        centro={centroDetalle}
        onClose={() => setCentroDetalle(null)}
      />
    </div>
  );
}
