import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import EtniaForm from '@/components/forms/catalogoForms/EtniaForm'

interface AddEtniaModalProp {
  fetchEtnias: () => Promise<void>
}

export default function AddEtniaModal({ fetchEtnias }: AddEtniaModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <EtniaForm
              onSuccess={() => {
                fetchEtnias()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
