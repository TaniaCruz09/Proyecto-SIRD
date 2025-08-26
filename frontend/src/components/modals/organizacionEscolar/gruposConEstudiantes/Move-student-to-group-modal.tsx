import React, { useState } from 'react';
import ModalBase from '../../ModalBase';
import BtnMove from '@/components/Buttons/BtnMove';
import MoveStudentToGroupForm from '@/components/forms/organizacionEscolarForms/MoveStudentToGroupForm';
import { GrupoConEstudiante } from '@/interfaces/organizacionEscolarInterface/grupoConEstudianteInterface';

interface MoveStudentToGroupModalProps {
    anioLectivo: string | null
    grupoConEstudiante: GrupoConEstudiante;
    idAnioLectivo: number;
    studentId: number;
    fetchGrupoConEstudiantes: () => Promise<void>;
}



export default function MoveStudentToGroupModal({
    anioLectivo,
    grupoConEstudiante,
    idAnioLectivo,
    studentId,
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
                            anioLectivo={anioLectivo}
                            defaultValues={grupoConEstudiante}
                            idAnioLectivo={idAnioLectivo}
                            studentId={studentId}
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
