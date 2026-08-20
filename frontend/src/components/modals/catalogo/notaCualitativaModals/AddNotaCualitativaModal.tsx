import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import NotaCualitativaForm from '@/components/forms/catalogoForms/NotaCualitativaForm'

interface AddNotaCualitativaModalProp {
  fetchNotas: () => Promise<void>
}

export default function AddNotaCualitativaModal({ fetchNotas }: AddNotaCualitativaModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <NotaCualitativaForm
              onSuccess={() => {
                fetchNotas()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
