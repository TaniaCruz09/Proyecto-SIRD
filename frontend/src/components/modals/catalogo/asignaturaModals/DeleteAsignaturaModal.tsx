import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteModalidad } from '@/actions/catalogos/modalidadMethods';

interface DeleteAsignaturaModalProps {
  idEliminar: number;
  fetchAsignaturas: () => Promise<void>;
}

export default function DeleteAsignaturaModal({idEliminar, fetchAsignaturas}:DeleteAsignaturaModalProps) {
    const [asignaturaToDelete, setAsignaturaToDelete] = useState<number | null>(null);
      const [showConfirm, setShowConfirm] = useState<boolean>(false);

      const handleDeleteClick = (id: number)=>{
        setAsignaturaToDelete(id);
        setShowConfirm(true);
      }

      const confirmDelete = async ()=>{
        if(!asignaturaToDelete) return;
        try{
            // await deleteAsignatura(asignaturaToDelete);
            await fetchAsignaturas();
        } catch (error) {
            console.error("error al eliminar la Asignatura", error)
        } finally {
            setShowConfirm(false);
            setAsignaturaToDelete(null)
        }
      } 
    
  return (
    <div>
        <BtnDelete onClick={()=> handleDeleteClick(idEliminar)}/>
        <ConfirmDeletModal onshow={showConfirm} onCancel={()=> setShowConfirm(false)} onConfirm={confirmDelete}/>
    </div>
  )
}
