import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Corte } from '@/interfaces';
import CorteEvaluativoForm from '@/components/forms/catalogoForms/CorteEvaluativoForm';

interface EditCorteEvaluativoModalProp{
    corteEvaluativo: Corte;
    fetchCortesEvaluativos: () => Promise<void>;
}

export default function EditCorteEvaluativoModal({corteEvaluativo, fetchCortesEvaluativos}:EditCorteEvaluativoModalProp) {
    const [showModal, setShowModal] = useState(false);
  return (
    <div>
        <BtnOpenEditModal onClick={()=> setShowModal(true)}/>
            {showModal && (
                <ModalBase
                onshowModal={showModal}
                onCloseModal={()=> setShowModal(false)}
                content={
                    <CorteEvaluativoForm
                    defaultValues={corteEvaluativo}
                    onSuccess={()=>{
                        fetchCortesEvaluativos();
                        setShowModal(false);
                    }}
                    />
                }
                />
            )}
    </div>
  )
}
