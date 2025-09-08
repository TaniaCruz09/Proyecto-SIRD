import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import SexoForm from '@/components/forms/catalogoForms/GeneroForm'

interface AddSexoModalProp {
  fetchGeneros: () => Promise<void>
}

export default function AddSexoModal({ fetchGeneros }: AddSexoModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <SexoForm
              onSuccess={() => {
                fetchGeneros()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
