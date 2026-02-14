"use client";


import React, { useState } from "react";
import ConfirmDeletModal from "../ModalConfirmDeletion";
import BtnDelete from "../../Buttons/BtnDelete";
import { deleteDocentes } from "@/actions/docentesMethods/docentesMethods";
import { useToast } from "@/hooks/use-toast";

interface DeleteDocenteModalProps {
  idEliminar: number;
  fetchDocentes: () => Promise<void>;
}

export default function DeleteDocenteModal({
  idEliminar,
  fetchDocentes,
}: DeleteDocenteModalProps) {
  const [docenteToDelete, setDocenteToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDeleteClick = (id: number) => {
    setDocenteToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!docenteToDelete) return;
    try {
      await deleteDocentes(docenteToDelete);
      await fetchDocentes();
      toast({
        title: "Registro eliminado",
        description: "El docente se eliminó correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error al eliminar docente", error);
    } finally {
      setShowConfirm(false);
      setDocenteToDelete(null);
    }
  };
  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal
        onshow={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
