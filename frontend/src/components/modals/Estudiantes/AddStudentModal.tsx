"use client"

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import { useState } from "react";
import ModalBase from "../ModalBase";
import RegisterEstudentForm from "@/components/forms/registerStudentForm";
import { useToast } from "@/hooks/use-toast";

interface AddStudentModalProp {
  fetchStudent: () => Promise<void>
}

export default function AddStudentModal({ fetchStudent }: AddStudentModalProp) {
  const {toast} = useToast()
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          containerClassName="max-w-5xl p-6 sm:p-8"
          content={
            <RegisterEstudentForm
              onSucess={() => {
                toast({
                  title: "Estudiante registrado",
                  description: "El estudiante se registró correctamente.",
                  variant: "success",
                })
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
