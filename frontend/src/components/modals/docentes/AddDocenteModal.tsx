"use client"
import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import { useState } from "react";
import ModalBase from "../ModalBase";
import DocenteForm from "@/components/forms/DocenteForm";

interface AddDocenteModalProp {
  fetchDocentes: () => Promise<void>
}

export default function AddDocenteModal({ fetchDocentes }: AddDocenteModalProp) {
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
