"use client";
import React, { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import BtnDelete from "../../Buttons/BtnDelete";
import { EliminarStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { useToast } from "@/hooks/use-toast";

interface DeleteStudentModalProps {
  idEliminar: number;
  studentFullName: string;
  fetchStudent: () => Promise<void>;
}

export default function DeleteStudentModal({
  idEliminar,
  studentFullName,
  fetchStudent,
}: DeleteStudentModalProps) {
  const { toast } = useToast();
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const normalizedFullName = studentFullName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
  const normalizedConfirmationName = confirmationName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
  const isConfirmationValid = normalizedConfirmationName === normalizedFullName;

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setConfirmationName("");
    setShowConfirm(true);
    toast({
      title: "Eliminacion peligrosa",
      description: "Esta accion no se puede revertir. Se eliminaran todas las asignaciones del estudiante en grupos y sus registros relacionados.",
      variant: "destructive",
    });
  };

  const handleClose = () => {
    setShowConfirm(false);
    setStudentToDelete(null);
    setConfirmationName("");
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (!studentToDelete || !isConfirmationValid) return;
    try {
      setIsDeleting(true);
      await EliminarStudent(studentToDelete);
      await fetchStudent();
      toast({
        title: "Registro eliminado",
        description: "El estudiante se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      toast({
        title: "No se pudo eliminar",
        description: "Ocurrio un error al intentar eliminar al estudiante.",
        variant: "destructive",
      });
    } finally {
      handleClose();
    }
  };

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-2xl text-red-500">
                <IoWarningOutline />
              </div>
            </div>

            <p className="text-center text-lg font-semibold text-gray-800">
              Estas a punto de eliminar a {studentFullName}
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              Escribe el nombre completo del estudiante para confirmar el borrado.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={`delete-student-${idEliminar}`}>
                Nombre completo del estudiante
              </label>
              <input
                id={`delete-student-${idEliminar}`}
                type="text"
                value={confirmationName}
                onChange={(event) => setConfirmationName(event.target.value)}
                placeholder={studentFullName}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-gray-500">
                Debe coincidir con: <span className="font-semibold text-gray-700">{studentFullName}</span>
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset transition hover:bg-gray-100"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300"
                disabled={!isConfirmationValid || isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar estudiante"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
