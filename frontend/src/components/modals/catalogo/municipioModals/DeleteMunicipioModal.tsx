import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteMunicipio } from '@/actions/catalogos/municipioMethods';

interface DeleteMunicipioModalProps {
  idEliminar: number;
  fetchMunicipios: () => Promise<void>;
}

export default function DeleteMunicipioModal({ idEliminar, fetchMunicipios }: DeleteMunicipioModalProps) {
  const [municipioToDelete, setMunicipioToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setMunicipioToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!municipioToDelete) return;
    try {
      await deleteMunicipio(municipioToDelete);
      await fetchMunicipios();
    } catch (error) {
      console.error("error al eliminar la municipio", error)
    } finally {
      setShowConfirm(false);
      setMunicipioToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
