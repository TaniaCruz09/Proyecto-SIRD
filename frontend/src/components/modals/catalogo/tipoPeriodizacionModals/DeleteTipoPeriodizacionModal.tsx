import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteTipoPeriodizacion } from '@/actions/catalogos/tipoPeriodizacionMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteTipoPeriodizacionModalProps {
  idEliminar: number;
  fetchTiposPeriodizacion: () => Promise<void>;
}

export default function DeleteTipoPeriodizacionModal({ idEliminar, fetchTiposPeriodizacion }: DeleteTipoPeriodizacionModalProps) {
  const { toast } = useToast();
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteTipoPeriodizacion(itemToDelete);
      await fetchTiposPeriodizacion();
      toast({
        title: "Registro eliminado",
        description: "El tipo de periodizacion se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar tipo de periodizacion", error)
      toast({
        title: "No se pudo eliminar",
        description: error instanceof Error ? error.message : "Ocurrio un error inesperado.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setItemToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
