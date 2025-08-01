import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal';
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import GrupoForm from '@/components/forms/organizacionEscolarForms/GrupoForm';

interface AddGruposModalProp {
    fetchGrupos: () => Promise<void>
}

export default function AddGruposModal({ fetchGrupos }: AddGruposModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <div>
            <BtnOpenAddModal onClick={() => setShowModal(true)} />
            {
                showModal && (
                    <ModalBase
                        onshowModal={showModal}
                        onCloseModal={() => setShowModal(false)}
                        content={
                            <GrupoForm
                                onSuccess={() => {
                                    fetchGrupos()
                                    setShowModal(false)
                                }} />
                        }
                    />
                )
            }
        </div>
    )
}
