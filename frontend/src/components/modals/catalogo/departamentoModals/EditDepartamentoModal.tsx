import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Departamento } from '@/interfaces';
import DepartamentoForm from '@/components/forms/catalogoForms/DepartamentoForm';

interface EditDepartamentoModalProp {
    departamento: Departamento;
    fetchDepartamentos: () => Promise<void>;
}

export default function EditDepartamentoModal({ departamento, fetchDepartamentos }: EditDepartamentoModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <DepartamentoForm
                            defaultValues={departamento}
                            onSuccess={() => {
                                fetchDepartamentos();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
