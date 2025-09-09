import React, { useState } from 'react';
import ModalBase from '../../ModalBase';
import BtnMove from '@/components/Buttons/BtnMove';
import MoveStudentToGroupForm from '@/components/forms/organizacionEscolarForms/MoveStudentToGroupForm';
interface MoveStudentToGroupModalProps {
    gradoId: number
    anioLectivo: number
    idAnioLectivo: number;
    estudianteId: number;
    grupoOrigenId: number
    fetchGrupoConEstudiantes: () => Promise<void>;
}

export default function MoveStudentToGroupModal({
    gradoId,
    grupoOrigenId,
    anioLectivo,
    idAnioLectivo,
    estudianteId,
    fetchGrupoConEstudiantes,
}: MoveStudentToGroupModalProps) {
    const [showModal, setShowModal] = useState(false)

    return (
        <div>
            <BtnMove onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <MoveStudentToGroupForm
                            gradoId={gradoId}
                            grupoOrigenId={grupoOrigenId}
                            anioLectivo={anioLectivo}
                            idAnioLectivo={idAnioLectivo}
                            estudianteId={estudianteId}
                            onSuccess={() => {
                                fetchGrupoConEstudiantes();
                                setShowModal(false)
                            }}
                        />
                    }
                />
            )}
        </div>
    );
}
