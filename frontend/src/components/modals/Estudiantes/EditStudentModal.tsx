"use client";

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useState } from "react";
import ModalBase from "../ModalBase";
import RegisterEstudentForm from "@/components/forms/registerStudentForm";
import BtnOpenEditModal from "@/components/Buttons/btnOpenEditModal";


interface EditStudentModalProps {
    student: RegisterEstudent
    fetchStudent: () => Promise<void>;
}
export default function EditStudentModal({ student, fetchStudent }: EditStudentModalProps) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    containerClassName="max-w-5xl p-6 sm:p-8"
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