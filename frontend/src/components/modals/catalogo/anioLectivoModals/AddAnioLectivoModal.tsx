import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import { AnioLectivoForm } from '@/components/forms/catalogoForms/anioLectivoForm';
import { useRouter } from 'next/navigation';

interface AddAniosLectivosModalProp {
  fetchAniosLectivos: () => Promise<void>
}

export default function AddAniosLectivosModal({ fetchAniosLectivos }: AddAniosLectivosModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div>
      <BtnOpenAddModal text="Nuevo Año Lectivo" onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          containerClassName="max-w-6xl overflow-hidden p-0"
          content={
            <AnioLectivoForm onSuccess={async (anioLectivo) => {
              await fetchAniosLectivos()
              setShowModal(false)
              router.push(`/catalogo/anioLectivo/calendarizacion?idAnioLectivo=${anioLectivo.id}`)
            }} />
          }
        />
      )}
    </div>
  )
}
