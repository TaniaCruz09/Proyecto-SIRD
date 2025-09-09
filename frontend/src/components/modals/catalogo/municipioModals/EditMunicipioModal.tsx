import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';

import { Municipio } from '@/interfaces';
import MunicipioForm from '@/components/forms/catalogoForms/MunicipioForm';

interface EditMunicipioModalProp {
    municipio: Municipio;
    fetchMunicipio: () => Promise<void>;
}

export default function EditMunicipioModal({ municipio: municipio, fetchMunicipio }: EditMunicipioModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <MunicipioForm
                            defaultValues={municipio}
                            onSuccess={() => {
                                fetchMunicipio();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
