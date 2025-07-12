import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteSemestre } from '@/actions/catalogos/semestreMethods';

interface DeleteSemestreModalProps {
  idEliminar: number;
  fetchSemestres: () => Promise<void>;
}

export default function DeleteSemestreModal({idEliminar, fetchSemestres}:DeleteSemestreModalProps) {
    const [semestreToDelete, setSemestreToDelete] = useState<number | null>(null);
      const [showConfirm, setShowConfirm] = useState<boolean>(false);

      const handleDeleteClick = (id: number)=>{
        setSemestreToDelete(id);
        setShowConfirm(true);
      }

      const confirmDelete = async ()=>{
        if(!semestreToDelete) return;
        try{
            await deleteSemestre(semestreToDelete);
            await fetchSemestres();
        } catch (error) {
            console.error("error al eliminar el Semestre", error)
        } finally {
            setShowConfirm(false);
            setSemestreToDelete(null)
        }
      } 
    
  return (
    <div>
        <BtnDelete onClick={()=> handleDeleteClick(idEliminar)}/>
        <ConfirmDeletModal onshow={showConfirm} onCancel={()=> setShowConfirm(false)} onConfirm={confirmDelete}/>
    </div>
  )
}
