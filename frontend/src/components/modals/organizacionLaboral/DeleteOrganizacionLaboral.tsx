"use client";


import React, { useState } from "react";
import ConfirmDeletModal from "../ModalConfirmDeletion";
import BtnDelete from "../../Buttons/BtnDelete";
import { EliminarOrganizacionLaboral } from "@/actions/organizacionLaboralMetodo/organizacionLaboralMetodo";

interface DeleteOrganizacionModalProps {
  idEliminar: number;
  fetchOrganizacionLaboral: () => Promise<void>;
}

export default function DeleteOrganizacionLaboralModal({
  idEliminar,
  fetchOrganizacionLaboral,
}: DeleteOrganizacionModalProps) {
  const [organizacionLaboralToDelete, setOrganizacionLaboralToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setOrganizacionLaboralToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!organizacionLaboralToDelete) return;
    try {
      await EliminarOrganizacionLaboral(organizacionLaboralToDelete);
      await fetchOrganizacionLaboral();
    } catch (error) {
      console.error("Error al eliminar organizacion Laboral", error);
    } finally {
      setShowConfirm(false);
      setOrganizacionLaboralToDelete(null);
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
