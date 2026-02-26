import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import AsignaturaForm from '@/components/forms/catalogoForms/AsignaturaForm';
import { useToast } from '@/hooks/use-toast';


interface AddAsignaturaModalProp {
  fetchAsignaturas: () => Promise<void>
}

export default function AddAsignaturaModal({ fetchAsignaturas }: AddAsignaturaModalProp) {
  const {toast} = useToast()
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <AsignaturaForm
              onSuccess={() => {
                toast({
                  title: "Asignatura guardada",
                  description: "La asignatura se guardó correctamente.",
                  variant: "success",
                })
                fetchAsignaturas()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
