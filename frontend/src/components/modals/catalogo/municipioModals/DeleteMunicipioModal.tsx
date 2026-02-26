import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteMunicipio } from '@/actions/catalogos/municipioMethods';
import { useToast } from '@/hooks/use-toast';

interface DeleteMunicipioModalProps {
  idEliminar: number;
  fetchMunicipios: () => Promise<void>;
}

export default function DeleteMunicipioModal({ idEliminar, fetchMunicipios }: DeleteMunicipioModalProps) {
  const { toast } = useToast();
  const [municipioToDelete, setMunicipioToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleDeleteClick = (id: number) => {
    setMunicipioToDelete(id);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    if (!municipioToDelete) return;
    try {
      await deleteMunicipio(municipioToDelete);
      await fetchMunicipios();
      toast({
        title: "Municipio eliminado",
        description: "El municipio se elimino correctamente.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("error al eliminar la municipio", error)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el municipio.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setMunicipioToDelete(null)
    }
  }

  return (
    <div>
      <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
      <ConfirmDeletModal onshow={showConfirm} onCancel={() => setShowConfirm(false)} onConfirm={confirmDelete} />
    </div>
  )
}
