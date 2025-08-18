"use client";
import ModalBase from "../ModalBase";
import { OrganizacionLaboral } from "@/interfaces/organizacionLaboralInterface";

interface ModalDetalleOrganizacionLaboralProps {
  organizacionLaboral: OrganizacionLaboral | null;
  onClose: () => void;
}

export default function ModalDetalleOrganizacionLaboral({
  organizacionLaboral,
  onClose,
}: ModalDetalleOrganizacionLaboralProps) {
  if (!organizacionLaboral) return null;

  return (
    <ModalBase
      onshowModal={!!organizacionLaboral}
      onCloseModal={onClose}
      content={
        <div className="max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl text-black font-semibold mb-4">Detalle de la organizacion escolar</h2>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Docente:</strong> {organizacionLaboral.docente?.nombres ?? "N/A"}
            </div>
            <div>
              <strong>Año lectivo:</strong> {organizacionLaboral.añolectivo?.anio_lectivo ?? "N/A"}
            </div>
            <div>
              <strong>grupo Guia:</strong> {organizacionLaboral.grupoGuia?.seccion.seccion ?? "N/A"}
            </div>
          </div>
        </div>
      }
    />
  );
}