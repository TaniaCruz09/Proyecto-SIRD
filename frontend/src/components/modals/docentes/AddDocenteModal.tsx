"use client"
import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import { useState } from "react";
import ModalBase from "../ModalBase";
import DocenteForm from "@/components/forms/DocenteForm";
import { useToast } from "@/hooks/use-toast";

interface AddDocenteModalProp {
  fetchDocentes: () => Promise<void>
}

export default function AddDocenteModal({ fetchDocentes }: AddDocenteModalProp) {
  const{toast} = useToast()
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <DocenteForm
              onSuccess={() => {
                toast({
                  title: "Docente registrado",
                  description: "El docente se registró correctamente.",
                  variant: "success",
                })
                fetchDocentes()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  );
}
