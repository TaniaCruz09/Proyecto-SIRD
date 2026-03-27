"use client";

import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import React, { useState } from "react";
import ModalBase from "../../ModalBase";
import TipoPeriodizacionForm from "@/components/forms/catalogoForms/TipoPeriodizacionForm";

interface AddTipoPeriodizacionModalProps {
  fetchTiposPeriodizacion: () => Promise<void>;
}

export default function AddTipoPeriodizacionModal({ fetchTiposPeriodizacion }: AddTipoPeriodizacionModalProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <TipoPeriodizacionForm
              onSuccess={() => {
                fetchTiposPeriodizacion();
                setShowModal(false);
              }}
            />
          }
        />
      )}
    </div>
  );
}
