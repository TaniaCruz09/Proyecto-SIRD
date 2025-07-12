import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import ModalidadForm from '@/components/forms/catalogoForms/ModalidadForm';
import { Modalidad } from '@/interfaces';

interface EditTurnoModalProp{
    modalidad: Modalidad;
    fetchModalidad: () => Promise<void>;
}

export default function EditTurnoModal({modalidad, fetchModalidad}:EditTurnoModalProp) {
    const [showModal, setShowModal] = useState(false);
  return (
    <div>
        <BtnOpenEditModal onClick={()=> setShowModal(true)}/>
            {showModal && (
                <ModalBase
                onshowModal={showModal}
                onCloseModal={()=> setShowModal(false)}
                content={
                    <ModalidadForm
                    defaultValues={modalidad}
                    onSuccess={()=>{
                        fetchModalidad();
                        setShowModal(false);
                    }}
                    />
                }
                />
            )}
    </div>
  )
}
