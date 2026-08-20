import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import GrupoForm from '@/components/forms/organizacionEscolarForms/GrupoForm';
import { GrupoEscolar, OrganizacionEscolar } from '@/interfaces';
import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal';

interface EditGrupoModalProps {
    grupo: GrupoEscolar
    fetchGrupos: () => Promise<void>
    organizacionEscolarFija?: OrganizacionEscolar
}

export default function EditGrupoModal({ grupo, fetchGrupos, organizacionEscolarFija }: EditGrupoModalProps) {
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
                            <GrupoForm
                                defaultValues={grupo}
                                organizacionEscolarFija={organizacionEscolarFija}
                                onSuccess={() => {
                                    fetchGrupos();
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
