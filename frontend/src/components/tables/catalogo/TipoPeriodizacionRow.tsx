"use client";

import DeleteTipoPeriodizacionModal from "@/components/modals/catalogo/tipoPeriodizacionModals/DeleteTipoPeriodizacionModal";
import EditTipoPeriodizacionModal from "@/components/modals/catalogo/tipoPeriodizacionModals/EditTipoPeriodizacionModal";
import { TipoPeriodizacion } from "@/interfaces";
import React from "react";

interface TipoPeriodizacionRowProps {
  fetchTiposPeriodizacion: () => Promise<void>;
  tipoPeriodizacion: TipoPeriodizacion;
}

export default function TipoPeriodizacionRow({
  fetchTiposPeriodizacion,
  tipoPeriodizacion,
}: TipoPeriodizacionRowProps) {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-3 border-b border-gray-200">{tipoPeriodizacion.id}</td>
      <td className="p-3 border-b border-gray-200">{tipoPeriodizacion.nombre}</td>
      <td className="p-3 border-b border-gray-200">{tipoPeriodizacion.cantidad_periodos}</td>
      <td className="p-3 border-b border-gray-200">{tipoPeriodizacion.prefijo_abreviatura || "-"}</td>
      <td className="p-3 border-b border-gray-200">
        <span className={`px-2 py-1 font-medium ${tipoPeriodizacion.isActive ? "text-green-600" : "text-red-600"}`}>
          {tipoPeriodizacion.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <EditTipoPeriodizacionModal
          tipoPeriodizacion={tipoPeriodizacion}
          fetchTiposPeriodizacion={fetchTiposPeriodizacion}
        />
      </td>
      <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
        <DeleteTipoPeriodizacionModal
          idEliminar={tipoPeriodizacion.id}
          fetchTiposPeriodizacion={fetchTiposPeriodizacion}
        />
      </td>
    </tr>
  );
}
