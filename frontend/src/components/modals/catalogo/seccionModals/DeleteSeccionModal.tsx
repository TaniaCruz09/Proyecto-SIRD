import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion'
import { deleteSeccion } from '@/actions/catalogos/seccionMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteSeccionModalProps {
  idEliminar: number;
  fetchSecciones: () => Promise<void>;
}

export default function DeleteSeccionModal({ idEliminar, fetchSecciones }: DeleteSeccionModalProps) {
  const { toast } = useToast();
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
      toast({
        title: "Registro eliminado",
        description: "La seccion se elimino correctamente.",
        variant: "destructive",
      });
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
