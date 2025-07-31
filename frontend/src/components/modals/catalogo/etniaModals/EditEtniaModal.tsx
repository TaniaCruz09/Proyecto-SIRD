import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Etnia } from '@/interfaces';
import EtniaForm from '@/components/forms/catalogoForms/EtniaForm';

interface EditEtniaModalProp {
    etnia: Etnia;
    fetchEtnias: () => Promise<void>;
}

export default function EditEtniaModal({ etnia, fetchEtnias }: EditEtniaModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <EtniaForm
                            defaultValues={etnia}
                            onSuccess={() => {
                                fetchEtnias();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
