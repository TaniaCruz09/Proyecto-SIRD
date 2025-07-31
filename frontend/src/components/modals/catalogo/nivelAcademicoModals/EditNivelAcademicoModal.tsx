import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { NivelAcademico } from '@/interfaces';
import NivelAcademicoForm from '@/components/forms/catalogoForms/NivelAcademicoForm';

interface EditNivelAcademicoModalProp {
    nivelAcademico: NivelAcademico;
    fetchNivelesAcademicos: () => Promise<void>;
}

export default function EditNivelAcademicoModal({ nivelAcademico, fetchNivelesAcademicos }: EditNivelAcademicoModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <NivelAcademicoForm
                            defaultValues={nivelAcademico}
                            onSuccess={() => {
                                fetchNivelesAcademicos();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
