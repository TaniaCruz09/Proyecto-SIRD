import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Profesion } from '@/interfaces';
import ProfesionForm from '@/components/forms/catalogoForms/ProfecionForm';

interface EditProfesionModalProp {
    profesion: Profesion;
    fetchProfesiones: () => Promise<void>;
}

export default function EditProfesionModal({ profesion, fetchProfesiones }: EditProfesionModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <ProfesionForm
                            defaultValues={profesion}
                            onSuccess={() => {
                                fetchProfesiones();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
