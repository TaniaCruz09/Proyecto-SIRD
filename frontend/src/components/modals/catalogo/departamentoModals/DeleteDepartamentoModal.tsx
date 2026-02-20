import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteDepartamento } from '@/actions/catalogos/departamentoMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteDepartamentoModalProps {
  idEliminar: number;
  fetchDepartamento: () => Promise<void>;
}

export default function DeleteDepartamentoModal({ idEliminar, fetchDepartamento }: DeleteDepartamentoModalProps) {
  const { toast } = useToast();
  const [departamentoToDelete, setDepartamentoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setDepartamentoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!departamentoToDelete) return;
    try {
      await deleteDepartamento(departamentoToDelete);
      await fetchDepartamento();
      toast({
        title: "Departamento eliminado",
        description: "El departamento se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar el departamento", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el departamento.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setDepartamentoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
