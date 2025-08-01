import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteProfesion } from '@/actions/catalogos/profesionMethods';

interface DeleteProfesionModalProps {
  idEliminar: number;
  fetchProfesiones: () => Promise<void>;
}

export default function DeleteProfesionModal({ idEliminar, fetchProfesiones }: DeleteProfesionModalProps) {
  const [profesionToDelete, setProfesionToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setProfesionToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!profesionToDelete) return;
    try {
      await deleteProfesion(profesionToDelete);
      await fetchProfesiones();
    } catch (error) {
      console.error("error al eliminar la profesion", error)
    } finally {
      setShowConfirm(false);
      setProfesionToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
