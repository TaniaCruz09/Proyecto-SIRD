import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion';
import { deleteAnioLectivo } from '@/actions/catalogos/anioLectivoMethods';

interface DeleteCentroEducativoModalProps {
  idEliminar: number;
  fetchCentroEducativo: () => Promise<void>;
}

export default function DeleteCentroEducativoModal({ idEliminar, fetchCentroEducativo }: DeleteCentroEducativoModalProps) {
  const [CentroEducativoToDelete, setCentroEducativoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setCentroEducativoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!CentroEducativoToDelete) return;
    try {
      await deleteAnioLectivo(CentroEducativoToDelete);
      await fetchCentroEducativo();
    } catch (error) {
      console.error("error al eliminar centro educativo", error)
    } finally {
      setShowConfirm(false);
      setCentroEducativoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
