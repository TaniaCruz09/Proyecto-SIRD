import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteNivelAcademico } from '@/actions/catalogos/academicLevelMethods';

interface DeleteNivelAcademicoModalProps {
  idEliminar: number;
  fetchNivelesAcademicos: () => Promise<void>;
}

export default function DeleteNivelAcademicoModal({ idEliminar, fetchNivelesAcademicos }: DeleteNivelAcademicoModalProps) {
  const [nivelAcademicoToDelete, setNivelAcademicoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setNivelAcademicoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!nivelAcademicoToDelete) return;
    try {
      await deleteNivelAcademico(nivelAcademicoToDelete);
      await fetchNivelesAcademicos();
    } catch (error) {
      console.error("error al eliminar el Nivel Academico", error)
    } finally {
      setShowConfirm(false);
      setNivelAcademicoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
