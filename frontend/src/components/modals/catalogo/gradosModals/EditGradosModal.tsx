import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Grado } from '@/interfaces';
import GradoForm from '@/components/forms/catalogoForms/GradoForm';

interface EditGradosModalProp {
    grado: Grado;
    fetchGrados: () => Promise<void>;
}

export default function EditGradosModal({ grado, fetchGrados }: EditGradosModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <GradoForm
                            defaultValues={grado}
                            onSuccess={() => {
                                fetchGrados();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
