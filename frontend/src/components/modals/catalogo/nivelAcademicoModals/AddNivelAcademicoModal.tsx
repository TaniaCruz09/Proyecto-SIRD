import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import NivelAcademicoForm from '@/components/forms/catalogoForms/NivelAcademicoForm'

interface AddNivelAcademicoModalProp {
  fetchNivelesAcademicos: () => Promise<void>
}

export default function AddNivelAcademicoModal({ fetchNivelesAcademicos }: AddNivelAcademicoModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <NivelAcademicoForm
              onSuccess={() => {
                fetchNivelesAcademicos()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
