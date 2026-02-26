import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion';
import { deleteCentro } from '@/actions/centroMethods/centroEducativoMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteCentroEducativoModalProps {
  idEliminar: number;
  fetchCentroEducativo: () => Promise<void>;
}

export default function DeleteCentroEducativoModal({ idEliminar, fetchCentroEducativo }: DeleteCentroEducativoModalProps) {
  const { toast } = useToast();
  const [CentroEducativoToDelete, setCentroEducativoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setCentroEducativoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!CentroEducativoToDelete) return;
    try {
      await deleteCentro(CentroEducativoToDelete);
      await fetchCentroEducativo();
      toast({
        title: "Centro eliminado",
        description: "El centro educativo se eliminó correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("error al eliminar centro educativo", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el centro educativo.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setCentroEducativoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
