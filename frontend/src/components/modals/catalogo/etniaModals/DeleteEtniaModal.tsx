import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion'
import { deleteEtnia } from '@/actions/catalogos/etniaMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteEtniaModalProps {
  idEliminar: number;
  fetchEtnias: () => Promise<void>;
}

export default function DeleteEtniaModal({ idEliminar, fetchEtnias }: DeleteEtniaModalProps) {
  const { toast } = useToast();
  const [etniaToDelete, setEtniaToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setEtniaToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!etniaToDelete) return;
    try {
      await deleteEtnia(etniaToDelete);
      await fetchEtnias();
      toast({
        title: "Etnia eliminada",
        description: "La etnia se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar la etnia", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la etnia.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setEtniaToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
