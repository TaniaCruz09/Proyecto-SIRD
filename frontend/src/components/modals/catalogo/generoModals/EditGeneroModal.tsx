import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Sexo } from '@/interfaces';
import SexoForm from '@/components/forms/catalogoForms/GeneroForm';

interface EditSexoModalProp {
    genero: Sexo;
    fetchGenero: () => Promise<void>;
}

export default function EditSexoModal({ genero: genero, fetchGenero }: EditSexoModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <SexoForm
                            defaultValues={genero}
                            onSuccess={() => {
                                fetchGenero();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
