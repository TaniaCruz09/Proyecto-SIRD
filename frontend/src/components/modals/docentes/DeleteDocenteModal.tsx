"use client";

import getDocentes, {
  deleteDocentes,
} from "@/actions/docentesMethods/docentesMethods";
import React, { useEffect, useState } from "react";
import ConfirmDeletModal from "../ModalConfirmDeletion";
import BtnDelete from "../../Buttons/BtnDelete";

interface DeleteDocenteModalProps {
  idEliminar: number;
  fetchDocentes: () => Promise<void>;
}

export default function DeleteDocenteModal({
  idEliminar,
  fetchDocentes,
}: DeleteDocenteModalProps) {
  const [DocenteToDelete, setDocenteToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setDocenteToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!DocenteToDelete) return;
    try {
      await deleteDocentes(DocenteToDelete);
      await fetchDocentes();
    } catch (error) {
      console.error("Error al eliminar usuario", error);
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
