import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Semestre } from '@/interfaces';
import SemestreForm from '@/components/forms/catalogoForms/SemestreForm';

interface EditSemestreModalProp {
    semestre: Semestre;
    fetchSemestres: () => Promise<void>;
}

export default function EditSemestreModal({ semestre, fetchSemestres }: EditSemestreModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <SemestreForm
                            defaultValues={semestre}
                            onSuccess={() => {
                                fetchSemestres();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
