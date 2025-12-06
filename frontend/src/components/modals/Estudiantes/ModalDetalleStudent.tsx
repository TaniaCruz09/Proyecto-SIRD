"use client";
import ModalBase from "../ModalBase";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";

interface ModalDetalleStudentProps {
  estudiante: RegisterEstudent | null;
  onClose: () => void;
}

export default function ModalDetalleStudent({
  estudiante,
  onClose,
}: ModalDetalleStudentProps) {
  if (!estudiante) return null;

  return (
    <ModalBase
      onshowModal={!!estudiante}
      onCloseModal={onClose}
      content={
        <div className="max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl text-black font-semibold mb-4">Detalle del Estudiante</h2>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Nombre:</strong> {estudiante.name}
            </div>
            <div>
              <strong>Apellidos:</strong> {estudiante.lastName}
            </div>
            <div>
              <strong>Codigo del estudiante:</strong> {estudiante.studentCode}
            </div>
            <div>
              <strong>Telefono del estudiante:</strong> {estudiante.phone}
            </div>
            <div>
              <strong>direcccion domiciliar:</strong> {estudiante.address}
            </div>
            <div>
              <strong>Cedula:</strong> {estudiante.identityCard}
            </div>
            <div>
              <strong>Fecha de nacimiento:</strong>{" "}
              {estudiante.dateBirt ? new Date(estudiante.dateBirt).toLocaleDateString() : 'N/A'}
            </div>
            <div>
              <strong>Municipio:</strong> {estudiante.municipio?.municipio ?? "N/A"}
            </div>
            <div>
              <strong>Genero:</strong> {estudiante.gender?.gender ?? 'N/A'}
            </div>
            <div>
              <strong>País:</strong> {estudiante.pais?.pais ?? "N/A"}
            </div>
            <div>
              <strong>Nombre del tutor:</strong> {estudiante.tutorName}
            </div>
            <div>
              <strong>Cedula del tutor:</strong> {estudiante.tutorIdentityCard}
            </div>
            <div>
              <strong>Teléfono del tutor:</strong> {estudiante.tutorPhoneNumber}
            </div>
            <div>
              <strong>Observacion:</strong> {estudiante.observations}
            </div>
          </div>
        </div>
      }
    />
  );
}