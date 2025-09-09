"use client";

import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal';
import ModalBase from '../ModalBase';
import DocenteForm from '@/components/forms/DocenteForm';
import { Docente } from '@/interfaces';
import { useState } from 'react';


interface EditDocenteModalProps {
  docente: Docente
  fetchDocentes: () => Promise<void>;
}

export default function EditDocenteModal({ docente, fetchDocentes }: EditDocenteModalProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* //llamo al componente con el diseño del boton de editar */}
      <BtnOpenEditModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <DocenteForm
              defaultValues={docente}
              onSuccess={() => {
                fetchDocentes();
                setShowModal(false);
              }}
            />
          }
        />
      )}
    </div>
  )
}
