"use client";
import {
  deleteDocentes,
} from "@/actions/docentesMethods/docentesMethods";
import React, { useState } from "react";
import ConfirmDeletModal from "../ModalConfirmDeletion";
import BtnDelete from "../../Buttons/BtnDelete";

interface DeleteStudentModalProps {
  idEliminar: number;
  fetchStudent: () => Promise<void>;
}

export default function DeleteStudentModal({
  idEliminar,
  fetchStudent,
}: DeleteStudentModalProps) {
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteDocentes(studentToDelete);
      await fetchStudent();
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    } finally {
      setShowConfirm(false);
      setStudentToDelete(null);
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
