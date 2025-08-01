"use client";
import { Docente } from "@/interfaces";
import ModalBase from "../ModalBase";

interface ModalDetalleDocenteProps {
  docente: Docente | null;
  onClose: () => void;
}

export default function ModalDetalleDocente({
  docente,
  onClose,
}: ModalDetalleDocenteProps) {
  if (!docente) return null;

  return (
    <ModalBase
      onshowModal={!!docente}
      onCloseModal={onClose}
      content={
        <div className="max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl text-black font-semibold mb-4">Detalle del Estudiante</h2>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Nombre:</strong> {docente.nombres}
            </div>
            <div>
              <strong>Apellido Paterno:</strong> {docente.apellido_paterno}
            </div>
            <div>
              <strong>Apellido Materno:</strong> {docente.apellido_materno}
            </div>
            <div>
              <strong>Sexo:</strong> {docente.sexo?.gender ?? "N/A"}
            </div>
            <div>
              <strong>Nivel Académico:</strong>{" "}
              {docente.nivel_academico.length > 0
                ? docente.nivel_academico
                  .map((n) => n.academicLevel)
                  .join(", ")
                : "N/A"}
            </div>
            <div>
              <strong>Profesión:</strong>{" "}
              {docente.profession.length > 0
                ? docente.profession.map((p) => p.profession).join(", ")
                : "N/A"}
            </div>
            <div>
              <strong>Teléfono:</strong> {docente.telefono}
            </div>
            <div>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {docente.fecha_nacimiento
                ? new Date(docente.fecha_nacimiento).toLocaleDateString()
                : "N/A"}
            </div>
            <div>
              <strong>País:</strong> {docente.pais?.pais ?? "N/A"}
            </div>
            <div>
              <strong>Municipio:</strong> {docente.municipio?.municipio ?? "N/A"}
            </div>
            <div>
              <strong>Fecha Contratado:</strong>{" "}
              {docente.fechaContratado
                ? new Date(docente.fechaContratado).toLocaleDateString()
                : "N/A"}
            </div>
            <div>
              <strong>Dirección Domiciliar:</strong> {docente.direccion_domiciliar}
            </div>
            <div>
              <strong>Contacto Emergencia:</strong> {docente.nombre_contacto_emergencia}
            </div>
            <div>
              <strong>Teléfono Contacto Emergencia:</strong>{" "}
              {docente.telefono_contacto_emergencia}
            </div>
          </div>
        </div>
      }
    />
  );
}