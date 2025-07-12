import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import ModalidadForm from '@/components/forms/catalogoForms/ModalidadForm';
import { Modalidad } from '@/interfaces';

interface EditSeccionModalProp{
    modalidad: Modalidad;
    fetchModalidad: () => Promise<void>;
}

export default function EditSeccionModal({modalidad, fetchModalidad}:EditSeccionModalProp) {
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
