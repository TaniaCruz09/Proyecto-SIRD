import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion';
import { deleteNotaCualitativa } from '@/actions/catalogos/notaCualitativaMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteNotaCualitativaModalProps {
  idEliminar: number;
  fetchNotas: () => Promise<void>;
}

export default function DeleteNotaCualitativaModal({ idEliminar, fetchNotas }: DeleteNotaCualitativaModalProps) {
  const { toast } = useToast();
  const [notaToDelete, setNotaToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setNotaToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!notaToDelete) return;
    try {
      await deleteNotaCualitativa(notaToDelete);
      await fetchNotas();
      toast({
        title: "Registro eliminado",
        description: "La nota cualitativa se eliminó correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("error al eliminar la nota cualitativa", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la nota cualitativa.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setNotaToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
