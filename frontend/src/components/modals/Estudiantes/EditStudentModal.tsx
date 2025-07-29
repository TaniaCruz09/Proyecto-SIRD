"use client";

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useState } from "react";
import ModalBase from "../ModalBase";
import RegisterEstudentForm from "@/components/forms/registerStudentForm";


interface EditStudentModalProps {
    student: RegisterEstudent
    fetchStudent: () => Promise<void>;
}
export default function EditStudentModal({ student, fetchStudent }: EditStudentModalProps) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenAddModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <RegisterEstudentForm
                            defeaultValues={student}
                            onSucess={() => {
                                fetchStudent();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}