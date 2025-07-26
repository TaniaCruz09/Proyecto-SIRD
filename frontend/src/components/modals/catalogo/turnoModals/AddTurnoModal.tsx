import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import TurnoForm from '@/components/forms/catalogoForms/TurnoForm'

interface AddTurnoModalProp{
    fetchTurno: () => Promise<void>
}

export default function AddTurnoModal({fetchTurno}: AddTurnoModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
        <BtnOpenAddModal onClick={()=> setShowModal(true)}/>
        {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <TurnoForm
            onSuccess={()=>{
                fetchTurno()
                setShowModal(false)
            }}
            />
          }
        />
      )}
    </div>
  )
}
