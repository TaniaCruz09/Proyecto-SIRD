import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteSexo } from '@/actions/catalogos/sexoMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteSexoModalProps {
  idEliminar: number;
  fetchGenero: () => Promise<void>;
}

export default function DeleteSexoModal({ idEliminar, fetchGenero }: DeleteSexoModalProps) {
  const { toast } = useToast();
  const [generoToDelete, setGeneroToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setGeneroToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!generoToDelete) return;
    try {
      await deleteSexo(generoToDelete);
      await fetchGenero();
      toast({
        title: "Genero eliminado",
        description: "El genero se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar la sexo", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el genero.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setGeneroToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
