import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion';
import { deleteAnioLectivo } from '@/actions/catalogos/anioLectivoMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteAñoLectivoModalProps {
  idEliminar: number;
  fetchAñoLectivo: () => Promise<void>;
}

export default function DeleteAñoLectivoModal({ idEliminar, fetchAñoLectivo }: DeleteAñoLectivoModalProps) {
  const [AñoLectivoToDelete, setAñoLectivoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDeleteClick = (id: number) => {
    setAñoLectivoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!AñoLectivoToDelete) return;
    try {
      await deleteAnioLectivo(AñoLectivoToDelete);
      await fetchAñoLectivo();
      toast({
        title: "Año lectivo eliminado",
        description: "Se eliminó correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("error al eliminar la año lectivo", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el año lectivo.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setAñoLectivoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
