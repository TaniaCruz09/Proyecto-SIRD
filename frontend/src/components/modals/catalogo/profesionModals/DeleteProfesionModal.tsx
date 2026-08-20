import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion'
import { deleteProfesion } from '@/actions/catalogos/profesionMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteProfesionModalProps {
  idEliminar: number;
  fetchProfesiones: () => Promise<void>;
}

export default function DeleteProfesionModal({ idEliminar, fetchProfesiones }: DeleteProfesionModalProps) {
  const { toast } = useToast();
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
      toast({
        title: "Profesión eliminada",
        description: "La profesión se eliminó correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("error al eliminar la profesion", error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la profesión.",
        variant: "destructive",
      });
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
