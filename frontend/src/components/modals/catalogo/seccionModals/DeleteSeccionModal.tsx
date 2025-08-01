import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteSeccion } from '@/actions/catalogos/seccionMethods';

interface DeleteSeccionModalProps {
  idEliminar: number;
  fetchSecciones: () => Promise<void>;
}

export default function DeleteSeccionModal({ idEliminar, fetchSecciones }: DeleteSeccionModalProps) {
  const [seccionToDelete, setSeccionToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setSeccionToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!seccionToDelete) return;
    try {
      await deleteSeccion(seccionToDelete);
      await fetchSecciones();
    } catch (error) {
      console.error("error al eliminar la seccion", error)
    } finally {
      setShowConfirm(false);
      setSeccionToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
