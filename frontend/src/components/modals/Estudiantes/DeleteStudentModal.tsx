"use client";
import React, { useState } from "react";
import ConfirmDeletModal from "../ModalConfirmDeletion";
import BtnDelete from "../../Buttons/BtnDelete";
import { EliminarStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { useToast } from "@/hooks/use-toast";

interface DeleteStudentModalProps {
  idEliminar: number;
  fetchStudent: () => Promise<void>;
}

export default function DeleteStudentModal({
  idEliminar,
  fetchStudent,
}: DeleteStudentModalProps) {
  const { toast } = useToast();
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await EliminarStudent(studentToDelete);
      await fetchStudent();
      toast({
        title: "Registro eliminado",
        description: "El estudiante se elimino correctamente.",
        variant: "destructive",
      });
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
