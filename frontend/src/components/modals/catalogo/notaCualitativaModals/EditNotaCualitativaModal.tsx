import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { NotaCualitativa } from '@/interfaces';
import NotaCualitativaForm from '@/components/forms/catalogoForms/NotaCualitativaForm';

interface EditNotaCualitativaModalProp {
    nota: NotaCualitativa;
    fetchNotas: () => Promise<void>;
}

export default function EditNotaCualitativaModal({ nota, fetchNotas }: EditNotaCualitativaModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <NotaCualitativaForm
                            defaultValues={nota}
                            onSuccess={() => {
                                fetchNotas();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
