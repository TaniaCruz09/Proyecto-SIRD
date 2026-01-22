import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import { AnioLectivoForm } from '@/components/forms/catalogoForms/anioLectivoForm';
import CentroEducativoForm from '@/components/forms/catalogoForms/centroEducativoForm';

interface AddCentroEducativoModalProp {
  fetchCentroEducativo: () => Promise<void>
}

export default function AddCentroEducativoModal({ fetchCentroEducativo }: AddCentroEducativoModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal text="Nuevo Centro Escolar" onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <CentroEducativoForm onSuccess={() => {
              fetchCentroEducativo()
              setShowModal(false)
            }} />
          }
        />
      )}
    </div>
  )
}
