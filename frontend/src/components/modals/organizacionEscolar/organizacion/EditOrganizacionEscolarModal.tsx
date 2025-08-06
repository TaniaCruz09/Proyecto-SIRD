"use client"

import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { OrganizacionEscolar } from '@/interfaces';
import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal';
import OrganizacionEscolarForm from '@/components/forms/organizacionEscolarForms/OrganizacionEscolarForm';

interface EditGrupoModalProps {
    organizacionEscolar: OrganizacionEscolar
    fetchOrganizacionEscolar: () => Promise<void>
}

export default function EditOrganizacionEscolarModal({ organizacionEscolar, fetchOrganizacionEscolar }: EditGrupoModalProps) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {
                showModal && (
                    <ModalBase
                        onshowModal={showModal}
                        onCloseModal={() => setShowModal(false)}
                        content={
                            <OrganizacionEscolarForm
                                defaultValues={organizacionEscolar}
                                onSuccess={() => {
                                    fetchOrganizacionEscolar();
                                    setShowModal(false);
                                }}
                            />
                        }
                    />
                )
            }
        </div>
    )
}
