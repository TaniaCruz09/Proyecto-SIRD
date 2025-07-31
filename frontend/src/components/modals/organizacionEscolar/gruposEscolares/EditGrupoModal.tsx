import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import GrupoForm from '@/components/forms/organizacionEscolarForms/GrupoForm';
import { GrupoEscolar } from '@/interfaces';
import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal';

interface EditGrupoModalProps {
    grupo: GrupoEscolar
    fetchGrupos: () => Promise<void>
}

export default function EditGrupoModal({ grupo, fetchGrupos }: EditGrupoModalProps) {
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
