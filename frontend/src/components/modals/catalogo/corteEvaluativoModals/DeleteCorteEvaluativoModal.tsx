import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteCorteEvaluativo } from '@/actions/catalogos/corteEvaluativoMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteCorteEvaluativoModalProps {
  idEliminar: number;
  fetchCortesEvaluativos: () => Promise<void>;
}

export default function DeleteCorteEvaluativoModal({ idEliminar, fetchCortesEvaluativos }: DeleteCorteEvaluativoModalProps) {
  const { toast } = useToast();
  const [corteEvaluativoToDelete, setCorteEvaluativoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setCorteEvaluativoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!corteEvaluativoToDelete) return;
    try {
      await deleteCorteEvaluativo(corteEvaluativoToDelete);
      await fetchCortesEvaluativos();
      toast({
        title: "Registro eliminado",
        description: "El corte evaluativo se eliminó correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar el Corte Evaluativo", error)
    } finally {
      setShowConfirm(false);
      setCorteEvaluativoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
