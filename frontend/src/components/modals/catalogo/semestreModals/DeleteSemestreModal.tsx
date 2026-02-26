import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteSemestre } from '@/actions/catalogos/semestreMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteSemestreModalProps {
  idEliminar: number;
  fetchSemestres: () => Promise<void>;
}

export default function DeleteSemestreModal({ idEliminar, fetchSemestres }: DeleteSemestreModalProps) {
  const { toast } = useToast();
  const [semestreToDelete, setSemestreToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setSemestreToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!semestreToDelete) return;
    try {
      await deleteSemestre(semestreToDelete);
      await fetchSemestres();
      toast({
        title: "Semestre eliminado",
        description: "El semestre se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar el Semestre", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el semestre.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setSemestreToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
