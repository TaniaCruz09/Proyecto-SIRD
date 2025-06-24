"use client";

import { useState } from "react";
import ModalBase from "../modals/ModalBase";

interface BtnModalWrapperProps {
  triggerButton: (openModal: () => void) => React.ReactNode;
  children: (handleClose: () => void) => React.ReactNode;
}

export default function BtnModalWrapper({ triggerButton, children }: BtnModalWrapperProps) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {triggerButton(openModal)}

      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={closeModal}
          content={children(closeModal)}
        />
      )}
    </>
  );
}
