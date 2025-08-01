import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import GradoForm from '@/components/forms/catalogoForms/GradoForm'

interface AddGradosModalProp {
  fetchGrados: () => Promise<void>
}

export default function AddGradosModal({ fetchGrados }: AddGradosModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <GradoForm
              onSuccess={() => {
                fetchGrados()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
