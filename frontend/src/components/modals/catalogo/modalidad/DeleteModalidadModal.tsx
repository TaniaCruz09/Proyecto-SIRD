import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion'
import { deleteModalidad } from '@/actions/catalogos/modalidadMethods';

interface DeleteModalidadModalProps {
  idEliminar: number;
  fetchModalidades: () => Promise<void>;
}

export default function DeleteModalidadModal({idEliminar, fetchModalidades}:DeleteModalidadModalProps) {
    const [modalidadToDelete, setModalidadToDelete] = useState<number | null>(null);
      const [showConfirm, setShowConfirm] = useState<boolean>(false);

      const handleDeleteClick = (id: number)=>{
        setModalidadToDelete(id);
        setShowConfirm(true);
      }

      const confirmDelete = async ()=>{
        if(!modalidadToDelete) return;
        try{
            await deleteModalidad(modalidadToDelete);
            await fetchModalidades();
        } catch (error) {
            console.error("error al eliminar la modalidad", error)
        } finally {
            setShowConfirm(false);
            setModalidadToDelete(null)
        }
      } 
    
  return (
    <div>
        <BtnDelete onClick={()=> handleDeleteClick(idEliminar)}/>
        <ConfirmDeletModal onshow={showConfirm} onCancel={()=> setShowConfirm(false)} onConfirm={confirmDelete}/>
    </div>
  )
}
