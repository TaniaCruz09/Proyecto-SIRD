import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import DepartamentoForm from '@/components/forms/catalogoForms/DepartamentoForm'

interface AddDepartamentoModalProp {
  fetchDepartamento: () => Promise<void>
}

export default function AddDepartamentoModal({ fetchDepartamento }: AddDepartamentoModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <DepartamentoForm
              onSuccess={() => {
                fetchDepartamento()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
