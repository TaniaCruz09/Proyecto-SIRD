import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import SeccionForm from '@/components/forms/catalogoForms/seccionForm';
import { Seccion } from '@/interfaces';

interface EditSeccionModalProp {
    seccion: Seccion;
    fetchSecciones: () => Promise<void>;
}

export default function EditSeccionModal({ seccion, fetchSecciones }: EditSeccionModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <SeccionForm
                            defaultValues={seccion}
                            onSuccess={() => {
                                fetchSecciones();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
