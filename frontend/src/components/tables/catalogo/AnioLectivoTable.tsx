"use client";

import { AnioLectivo } from "@/interfaces";
import AnioLectivoRow from "./AnioLectivoRow";
import Pagination from "@/components/paginacion/paginacion";
import { usePagination } from "@/components/paginacion/usePaginacion";

interface AnioLectivoProp {
  anioLectivo: AnioLectivo[];
  fetchAniosLectivos: () => Promise<void>;
}

export default function AnioLectivoTable({
  anioLectivo,
  fetchAniosLectivos,
}: AnioLectivoProp) {
  const {
    currentPage,
    setCurrentPage,
    currentItems,
  } = usePagination(anioLectivo, 5);

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b">Id</th>
              <th className="p-3 border-b">Años Lectivos</th>
              <th className="p-3 border-b">Cortes</th>
              <th className="p-3 border-b">Estado</th>
              <th className="p-1 border-b text-center">Calendario</th>
              <th className="p-1 border-b text-center">Editar</th>
              <th className="p-1 border-b text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {anioLectivo.length > 0 ? (
              currentItems.map((item) => (
                <AnioLectivoRow
                  key={item.id}
                  fetchAniosLectivos={fetchAniosLectivos}
                  anioLectivo={item}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3">
                  No hay años lectivos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={anioLectivo.length}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
