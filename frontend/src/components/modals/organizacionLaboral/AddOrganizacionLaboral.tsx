"use client"

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import { useState } from "react";
import ModalBase from "../ModalBase";
import OrganizacionLaboralForm from "@/components/forms/organizacionLaboralForm";

interface AddOrganizacionLaboralModalProp {
    fetchOrganizacionLaboral: () => Promise<void>
}

export default function AddOrganizacionLaboralModal({fetchOrganizacionLaboral}: AddOrganizacionLaboralModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <OrganizacionLaboralForm
            onSucess={()=>{
                fetchOrganizacionLaboral()
                setShowModal(false)
            }}
            />
          }
        />
      )}
    </div>
  );
}
