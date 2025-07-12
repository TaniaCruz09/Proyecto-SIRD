import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import CorteEvaluativoForm from '@/components/forms/catalogoForms/CorteEvaluativoForm'

interface AddCorteEvaluativoModalProp{
    fetchCortesEvaluativos: () => Promise<void>
}

export default function AddCorteEvaluativoModal({fetchCortesEvaluativos}: AddCorteEvaluativoModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
        <BtnOpenAddModal onClick={()=> setShowModal(true)}/>
        {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <CorteEvaluativoForm
            onSuccess={()=>{
                fetchCortesEvaluativos()
                setShowModal(false)
            }}
            />
          }
        />
      )}
    </div>
  )
}
