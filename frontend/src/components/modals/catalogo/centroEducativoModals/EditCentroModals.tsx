import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { AnioLectivoForm } from '@/components/forms/catalogoForms/anioLectivoForm';
import CentroEducativoForm from '@/components/forms/catalogoForms/centroEducativoForm';
import { CentroEscolar } from '@/interfaces/centroInterface';

interface EditCentroEducativoModalProp {
    CentroEducativo: CentroEscolar;
    fetchCentroEducativo: () => Promise<void>;
}

export default function EditCentroEducativoModal({ CentroEducativo, fetchCentroEducativo }: EditCentroEducativoModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <CentroEducativoForm
                            defaultValues={CentroEducativo}
                            onSuccess={() => {
                                fetchCentroEducativo();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
