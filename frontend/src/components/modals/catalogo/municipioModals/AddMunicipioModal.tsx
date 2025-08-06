import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import MunicipioForm from '@/components/forms/catalogoForms/MunicipioForm'

interface AddMunicipioModalProp{
    fetchMunicipio: () => Promise<void>
}

export default function AddMunicipioModal({fetchMunicipio}: AddMunicipioModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
        <BtnOpenAddModal onClick={()=> setShowModal(true)}/>
        {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <MunicipioForm
            onSuccess={()=>{
                fetchMunicipio()
                setShowModal(false)
            }}
            />
          }
        />
      )}
    </div>
  )
}
