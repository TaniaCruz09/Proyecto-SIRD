import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import SemestreForm from '@/components/forms/catalogoForms/SemestreForm'

interface AddSemestreModalProp {
  fetchSemestres: () => Promise<void>
}

export default function AddSemestreModal({ fetchSemestres }: AddSemestreModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <SemestreForm
              onSuccess={() => {
                fetchSemestres()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
