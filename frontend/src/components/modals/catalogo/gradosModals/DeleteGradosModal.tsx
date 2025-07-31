import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteGrado } from '@/actions/catalogos/gradoMethods';

interface DeleteGradosModalProps {
  idEliminar: number;
  fetchGrados: () => Promise<void>;
}

export default function DeleteGradosModal({ idEliminar, fetchGrados }: DeleteGradosModalProps) {
  const [gradoToDelete, setGradoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setGradoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!gradoToDelete) return;
    try {
      await deleteGrado(gradoToDelete);
      await fetchGrados();
    } catch (error) {
      console.error("error al eliminar el grado", error)
    } finally {
      setShowConfirm(false);
      setGradoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
