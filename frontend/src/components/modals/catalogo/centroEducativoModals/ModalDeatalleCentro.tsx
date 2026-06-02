"use client";
import ModalBase from "../../ModalBase";
import { CentroEscolar } from "@/interfaces/centroInterface";

interface ModalDetalleCentroProps {
  centro: CentroEscolar | null;
  onClose: () => void;
}

export default function ModalDetallecentro({
  centro,
  onClose,
}: ModalDetalleCentroProps) {
  if (!centro) return null;

  return (
    <ModalBase
      onshowModal={!!centro}
      onCloseModal={onClose}
      content={
        <div className="max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl text-black font-semibold mb-4">Detalle del centro</h2>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Nombre del centro:</strong> {centro.nombreCentro}
            </div>
            <div>
              <strong>Codigo del establecimiento:</strong> {centro.codigoEstablecimiento}
            </div>
            <div>
              <strong>Codigo del centro:</strong> {centro.codigoCentro}
            </div>
            <div>
              <strong>Direccion:</strong> {centro.direccionCentro}
            </div>
            <div>
              <strong>Municipio:</strong> {centro.municipio.municipio ?? "N/A"}
            </div>              
           
          </div>
        </div>
      }
    />
  );
}