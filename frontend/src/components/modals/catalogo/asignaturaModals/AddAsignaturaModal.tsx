import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import AsignaturaForm from '@/components/forms/catalogoForms/AsignaturaForm';


interface AddAsignaturaModalProp {
  fetchAsignaturas: () => Promise<void>
}

export default function AddAsignaturaModal({ fetchAsignaturas }: AddAsignaturaModalProp) {
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
