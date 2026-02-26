"use client";

import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal';
import ModalBase from '../ModalBase';
import DocenteForm from '@/components/forms/DocenteForm';
import { Docente } from '@/interfaces';
import { useEffect, useState } from 'react';
import { getDocenteById } from '@/actions/docentesMethods/docentesMethods';


interface EditDocenteModalProps {
  docente: Docente
  fetchDocentes: () => Promise<void>;
}

export default function EditDocenteModal({ docente, fetchDocentes }: EditDocenteModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [docenteDetalle, setDocenteDetalle] = useState<Docente | null>(docente);

  useEffect(() => {
    if (!showModal) return;

    const fetchDetalle = async () => {
      try {
        const detalle = await getDocenteById(docente.id);
        setDocenteDetalle(detalle);
      } catch (error) {
        console.error('Error al obtener detalle de docente:', error);
        setDocenteDetalle(docente);
      }
    };

    fetchDetalle();
  }, [showModal, docente]);

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
              defaultValues={docenteDetalle ?? docente}
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
