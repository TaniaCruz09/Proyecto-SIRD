import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion'
import { useToast } from '@/hooks/use-toast';
import { deleteAsignatura } from '@/actions/catalogos/asignaturaMethods';

interface DeleteAsignaturaModalProps {
  idEliminar: number;
  fetchAsignaturas: () => Promise<void>;
}

export default function DeleteAsignaturaModal({ idEliminar, fetchAsignaturas }: DeleteAsignaturaModalProps) {
  const { toast } = useToast();
  const [asignaturaToDelete, setAsignaturaToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setAsignaturaToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!asignaturaToDelete) return;
    try {
      await deleteAsignatura(asignaturaToDelete);
      await fetchAsignaturas();
      toast({
        title: "Registro eliminado",
        description: "La asignatura se eliminó correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar la Asignatura", error)
    } finally {
      setShowConfirm(false);
      setAsignaturaToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
