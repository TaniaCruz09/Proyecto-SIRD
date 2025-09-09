import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { Turno } from '@/interfaces';
import TurnoForm from '@/components/forms/catalogoForms/TurnoForm';

interface EditTurnoModalProp {
    turno: Turno;
    fetchTurno: () => Promise<void>;
}

export default function EditTurnoModal({ turno, fetchTurno }: EditTurnoModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <TurnoForm
                            defaultValues={turno}
                            onSuccess={() => {
                                fetchTurno();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
