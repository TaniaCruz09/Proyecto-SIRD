import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Asignatura } from '@/interfaces';
import AsignaturaForm from '@/components/forms/catalogoForms/AsignaturaForm';

interface EditAsignaturaModalProp {
    asignatura: Asignatura;
    fetchAsignatura: () => Promise<void>;
}

export default function EditAsignaturaModal({ asignatura, fetchAsignatura }: EditAsignaturaModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <AsignaturaForm
                            defaultValues={asignatura}
                            onSuccess={() => {
                                fetchAsignatura();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
