import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deletePais } from '@/actions/catalogos/paisMethods';
import { useToast } from '@/hooks/use-toast';

interface DeletePaisModalProps {
  idEliminar: number;
  fetchPaises: () => Promise<void>;
}

export default function DeletePaisModal({ idEliminar, fetchPaises }: DeletePaisModalProps) {
  const { toast } = useToast();
  const [paisToDelete, setPaisToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setPaisToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!paisToDelete) return;
    try {
      await deletePais(paisToDelete);
      await fetchPaises();
      toast({
        title: "Pais eliminado",
        description: "El pais se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar el Pais", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el pais.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setPaisToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
