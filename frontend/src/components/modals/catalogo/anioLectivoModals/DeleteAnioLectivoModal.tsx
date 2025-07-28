import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion';
import { deleteAnioLectivo } from '@/actions/catalogos/anioLectivoMethods';

interface DeleteAñoLectivoModalProps {
  idEliminar: number;
  fetchAñoLectivo: () => Promise<void>;
}

export default function DeleteAñoLectivoModal({idEliminar, fetchAñoLectivo}:DeleteAñoLectivoModalProps) {
    const [AñoLectivoToDelete, setAñoLectivoToDelete] = useState<number | null>(null);
      const [showConfirm, setShowConfirm] = useState<boolean>(false);

      const handleDeleteClick = (id: number)=>{
        setAñoLectivoToDelete(id);
        setShowConfirm(true);
      }

      const confirmDelete = async ()=>{
        if(!AñoLectivoToDelete) return;
        try{
            await deleteAnioLectivo(AñoLectivoToDelete);
            await fetchAñoLectivo();
        } catch (error) {
            console.error("error al eliminar la año lectivo", error)
        } finally {
            setShowConfirm(false);
            setAñoLectivoToDelete(null)
        }
      } 
    
  return (
    <div>
        <BtnDelete onClick={()=> handleDeleteClick(idEliminar)}/>
        <ConfirmDeletModal onshow={showConfirm} onCancel={()=> setShowConfirm(false)} onConfirm={confirmDelete}/>
    </div>
  )
}
