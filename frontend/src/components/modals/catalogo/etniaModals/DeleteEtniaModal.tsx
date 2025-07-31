import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteEtnia } from '@/actions/catalogos/etniaMethods';

interface DeleteEtniaModalProps {
  idEliminar: number;
  fetchEtnias: () => Promise<void>;
}

export default function DeleteEtniaModal({ idEliminar, fetchEtnias }: DeleteEtniaModalProps) {
  const [etniaToDelete, setEtniaToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setEtniaToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!etniaToDelete) return;
    try {
      await deleteEtnia(etniaToDelete);
      await fetchEtnias();
    } catch (error) {
      console.error("error al eliminar la etnia", error)
    } finally {
      setShowConfirm(false);
      setEtniaToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
