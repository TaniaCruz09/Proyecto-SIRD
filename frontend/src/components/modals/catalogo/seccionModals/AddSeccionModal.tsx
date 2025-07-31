import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import SeccionForm from '@/components/forms/catalogoForms/seccionForm'

interface AddSeccionModalProp {
  fetchSecciones: () => Promise<void>
}

export default function AddSeccionModal({ fetchSecciones }: AddSeccionModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <SeccionForm
              onSuccess={() => {
                fetchSecciones()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
