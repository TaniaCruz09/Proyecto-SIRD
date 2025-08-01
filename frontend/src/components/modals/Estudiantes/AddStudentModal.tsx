"use client"

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import { useState } from "react";
import ModalBase from "../ModalBase";
import RegisterEstudentForm from "@/components/forms/registerStudentForm";

interface AddStudentModalProp {
    fetchStudent: () => Promise<void>
}

export default function AddStudentModal({fetchStudent}: AddStudentModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <RegisterEstudentForm
            onSucess={()=>{
                fetchStudent()
                setShowModal(false)
            }}
            />
          }
        />
      )}
    </div>
  );
}
