import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import ModalidadForm from '@/components/forms/catalogoForms/ModalidadForm'

interface AddModalidadModalProp{
    fetchModalidades: () => Promise<void>
}

export default function AddModalidadModal({fetchModalidades}: AddModalidadModalProp) {
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
