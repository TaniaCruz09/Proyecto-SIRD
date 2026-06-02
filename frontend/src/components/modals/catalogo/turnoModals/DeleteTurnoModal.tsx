import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion';
import { deleteTurno } from '@/actions/catalogos/turnoMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteTurnoModalProps {
  idEliminar: number;
  fetchTurno: () => Promise<void>;
}

export default function DeleteTurnoModal({ idEliminar, fetchTurno }: DeleteTurnoModalProps) {
  const { toast } = useToast();
  const [turnoToDelete, setTurnoToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setTurnoToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!turnoToDelete) return;
    try {
      await deleteTurno(turnoToDelete);
      await fetchTurno();
      toast({
        title: "Registro eliminado",
        description: "El turno se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar la turno", error)
    } finally {
      setShowConfirm(false);
      setTurnoToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
