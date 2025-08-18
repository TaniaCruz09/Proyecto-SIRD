import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal';
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import OrganizacionEscolarForm from '@/components/forms/organizacionEscolarForms/OrganizacionEscolarForm';

interface AddOrganizacionEscolarModalProp {
    fetchOrganizacionEscolar: () => Promise<void>
}

export default function AddOrganizacionEscolarModal({ fetchOrganizacionEscolar }: AddOrganizacionEscolarModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <div>
            <BtnOpenAddModal text={"Agregar nueva organizacion"} onClick={() => setShowModal(true)} />
            {
                showModal && (
                    <ModalBase
                        onshowModal={showModal}
                        onCloseModal={() => setShowModal(false)}
                        content={
                            <OrganizacionEscolarForm
                                onSuccess={() => {
                                    fetchOrganizacionEscolar()
                                    setShowModal(false)
                                }} />
                        }
                    />
                )
            }
        </div>
    )
}
