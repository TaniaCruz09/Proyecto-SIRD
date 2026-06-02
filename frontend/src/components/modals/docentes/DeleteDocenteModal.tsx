"use client";
import React, { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import BtnDelete from "../../Buttons/BtnDelete";
import { deleteDocentes } from "@/actions/docentesMethods/docentesMethods";
import { useToast } from "@/hooks/use-toast";

interface DeleteDocenteModalProps {
  idEliminar: number;
  docenteFullName: string;
  fetchDocentes: () => Promise<void>;
}

export default function DeleteDocenteModal({
  idEliminar,
  docenteFullName,
  fetchDocentes,
}: DeleteDocenteModalProps) {
  const { toast } = useToast();
  const [docenteToDelete, setDocenteToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Normalize names for comparison (ignore case & whitespace)
  const normalizedFullName = docenteFullName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
  const normalizedConfirmationName = confirmationName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
  const isConfirmationValid = normalizedConfirmationName === normalizedFullName;

  const handleDeleteClick = (id: number) => {
    setDocenteToDelete(id);
    setConfirmationName("");
    setShowConfirm(true);
    toast({
      title: "Eliminacion peligrosa",
      description: "Esta accion no se puede revertir. Se eliminaran todas las asignaciones del docente en grupos y sus registros relacionados.",
      variant: "destructive",
    });
  };

  const handleClose = () => {
    setShowConfirm(false);
    setDocenteToDelete(null);
    setConfirmationName("");
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (!docenteToDelete || !isConfirmationValid) return;
    try {
      setIsDeleting(true);
      await deleteDocentes(docenteToDelete);
      await fetchDocentes();
      toast({
        title: "Registro eliminado",
        description: "El docente se eliminó correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error al eliminar docente", error);
      toast({
        title: "No se pudo eliminar",
        description: "Ocurrio un error al intentar eliminar al docente.",
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
              Estas a punto de eliminar a {docenteFullName}
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              Escribe el nombre completo del docente para confirmar el borrado.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={`delete-docente-${idEliminar}`}>
                Nombre completo del docente
              </label>
              <input
                id={`delete-docente-${idEliminar}`}
                type="text"
                value={confirmationName}
                onChange={(event) => setConfirmationName(event.target.value)}
                placeholder={docenteFullName}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-gray-500">
                Debe coincidir con: <span className="font-semibold text-gray-700">{docenteFullName}</span>
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
                {isDeleting ? "Eliminando..." : "Eliminar docente"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
