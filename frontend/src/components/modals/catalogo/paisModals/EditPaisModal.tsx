import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Pais } from '@/interfaces';
import PaisForm from '@/components/forms/catalogoForms/PaisForm';

interface EditPaisModalProp {
    pais: Pais;
    fetchPaises: () => Promise<void>;
}

export default function EditPaisModal({ pais, fetchPaises }: EditPaisModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <PaisForm
                            defaultValues={pais}
                            onSuccess={() => {
                                fetchPaises();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
