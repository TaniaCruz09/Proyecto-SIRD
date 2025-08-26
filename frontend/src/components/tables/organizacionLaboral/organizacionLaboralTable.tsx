"use client";

import React, { useState, useEffect } from "react";

import { OrganizacionLaboral } from "@/interfaces/organizacionLaboralInterface";
import OrganizacionLaboralRow from "./organizacionLaboralRow";
import ModalDetalleOrganizacionLaboral from "@/components/modals/organizacionLaboral/ModalDetalleOrganizacionLaboral";
import AsignaturaGruposForm from "@/components/forms/asignaturasAGruposForm";
import { Asignatura, GrupoEscolar } from "@/interfaces";

interface OrganizacionLaboralTableProps {
  organizacionLaboral: OrganizacionLaboral[];
  fetchOrganizacionLaboral: () => Promise<void>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/api/v1";

export default function OrganizacionLaboralTable({
  organizacionLaboral,
  fetchOrganizacionLaboral,
}: OrganizacionLaboralTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [organizacionLaboralDetalle, setOrganizacionLaboralDetalle] = useState<OrganizacionLaboral | null>(null);
  const [organizacionLaboralFormId, setOrganizacionLaboralFormId] = useState<number | null>(null);

  // listas para el formulario
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState<Asignatura[]>([]);
  const [gruposDisponibles, setGruposDisponibles] = useState<GrupoEscolar[]>([]);

  // cargar datos SOLO cuando se abra el modal
  useEffect(() => {
    if (organizacionLaboralFormId === null) return;
    let mounted = true;

    (async () => {
      try {
        const [resAsig, resGrupos] = await Promise.all([
          fetch(`${API_BASE}/asignatura`),
          fetch(`${API_BASE}/grupos`),
        ]);

        const [asigJson, gruposJson] = await Promise.all([resAsig.json(), resGrupos.json()]);

        const asigArray = Array.isArray(asigJson) ? asigJson : Array.isArray(asigJson?.data) ? asigJson.data : [];
        const gruposArray = Array.isArray(gruposJson) ? gruposJson : Array.isArray(gruposJson?.data) ? gruposJson.data : [];

        if (mounted) {
          setAsignaturasDisponibles(asigArray);
          setGruposDisponibles(gruposArray);
        }
      } catch (err) {
        console.error("Error al cargar asignaturas/grupos:", err);
        setAsignaturasDisponibles([]);
        setGruposDisponibles([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [organizacionLaboralFormId]);

  const OrganizacionLaboralPerPage = 5;
  const indexOfLastOrganizacionLaboral = currentPage * OrganizacionLaboralPerPage;
  const indexOfFirstDocente = indexOfLastOrganizacionLaboral - OrganizacionLaboralPerPage;
  const currentOrganizacionLaboral = organizacionLaboral.slice(indexOfFirstDocente, indexOfLastOrganizacionLaboral);

  // Función para manejar el submit del formulario de asignar grupos y asignaturas
  const handleSubmit = async (data: {
    organizacionLaboralId: number;
    grupos: { grupoId: number; asignaturasIds: number[] }[];
  }) => {
    try {
      // Aquí deberías llamar a tu API para guardar los datos
      // Ejemplo:
      // await saveAsignaturasGrupos(data);
      console.log("Datos para enviar:", data);
      alert("Asignaciones guardadas correctamente");
      setOrganizacionLaboralFormId(null); // Cerrar modal después de guardar
      fetchOrganizacionLaboral(); // Recargar tabla si es necesario
    } catch (error) {
      console.error("Error guardando asignaciones:", error);
      alert("Error guardando asignaciones");
    }
  };

  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Docente</th>
              <th className="p-3 border-b border-gray-300">Año Lectivo</th>
              <th className="p-3 border-b border-gray-300">Grupo Guia</th>
              <th className="p-3 border-b border-gray-300">Grupos y asignaturas asignados</th>
              <th className="p-3 border-b border-gray-300">Agregar grupos y asignaturas</th>
              <th className="p-1 border-b border-gray-300 text-center">Mas Informacion</th>
              <th className="p-1 border-b border-gray-300 text-center">Editar</th>
              <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody className="text-black text-sm">
            {organizacionLaboral.length > 0 ? (
              currentOrganizacionLaboral.map((organizacion) => (
                <OrganizacionLaboralRow
                  key={organizacion.id}
                  fetchorganizacionLaboral={fetchOrganizacionLaboral}
                  organizacionLaboral={organizacion}
                  onShowDetail={() => setOrganizacionLaboralDetalle(organizacion)}
                  onOpenFormAsignaturas={(id) => setOrganizacionLaboralFormId(id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-3">
                  No hay organizacion laboral registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
        <p>
          Página {currentPage} de {Math.ceil(organizacionLaboral.length / OrganizacionLaboralPerPage)}
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
                prev < Math.ceil(organizacionLaboral.length / OrganizacionLaboralPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage === Math.ceil(organizacionLaboral.length / OrganizacionLaboralPerPage)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
      {/* Modal detalle organizacion laboral */}
      <ModalDetalleOrganizacionLaboral
        organizacionLaboral={organizacionLaboralDetalle}
        onClose={() => setOrganizacionLaboralDetalle(null)}
      />

      {/* Modal para formulario de asignar grupos y asignaturas */}
      {organizacionLaboralFormId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setOrganizacionLaboralFormId(null)}
            >
              ✖
            </button>
            <AsignaturaGruposForm
              organizacionLaboralId={organizacionLaboralFormId}
              // asignaturasDisponibles={asignaturasDisponibles}
              // gruposDisponibles={gruposDisponibles}
              onSubmitForm={handleSubmit}
              onSuccess={() => {
                alert("Guardado con éxito");
                setOrganizacionLaboralFormId(null);
                fetchOrganizacionLaboral();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
