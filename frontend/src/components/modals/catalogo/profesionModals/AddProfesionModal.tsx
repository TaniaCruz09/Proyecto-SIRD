import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import ProfesionForm from '@/components/forms/catalogoForms/ProfecionForm'

interface AddProfesionModalProp {
  fetchProfesiones: () => Promise<void>
}

export default function AddProfesionModal({ fetchProfesiones }: AddProfesionModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <ProfesionForm
              onSuccess={() => {
                fetchProfesiones()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
