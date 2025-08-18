import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import { AnioLectivoForm } from '@/components/forms/catalogoForms/anioLectivoForm';

interface AddAniosLectivosModalProp {
  fetchAniosLectivos: () => Promise<void>
}

export default function AddAniosLectivosModal({ fetchAniosLectivos }: AddAniosLectivosModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal text="Nuevo Año Lectivo" onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <AnioLectivoForm onSuccess={() => {
              fetchAniosLectivos()
              setShowModal(false)
            }} />
          }
        />
      )}
    </div>
  )
}
