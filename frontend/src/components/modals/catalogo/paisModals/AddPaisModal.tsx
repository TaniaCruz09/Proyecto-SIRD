import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import PaisForm from '@/components/forms/catalogoForms/PaisForm'

interface AddPaisModalProp {
  fetchPaises: () => Promise<void>
}

export default function AddPaisModal({ fetchPaises }: AddPaisModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <PaisForm
              onSuccess={() => {
                fetchPaises()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
