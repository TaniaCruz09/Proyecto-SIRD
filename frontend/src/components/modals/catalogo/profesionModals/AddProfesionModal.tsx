import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import ModalidadForm from '@/components/forms/catalogoForms/ModalidadForm'

interface AddProfesionModalProp{
    fetchModalidades: () => Promise<void>
}

export default function AddProfesionModal({fetchModalidades}: AddProfesionModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
        <BtnOpenAddModal onClick={()=> setShowModal(true)}/>
        {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <ModalidadForm
            onSuccess={()=>{
                fetchModalidades()
                setShowModal(false)
            }}
            />
          }
        />
      )}
    </div>
  )
}
