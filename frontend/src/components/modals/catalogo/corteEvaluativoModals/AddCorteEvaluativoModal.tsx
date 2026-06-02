"use client"

import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase'
import CorteEvaluativoForm from '@/components/forms/catalogoForms/CorteEvaluativoForm'
import { useToast } from '@/hooks/use-toast'

interface AddCorteEvaluativoModalProp {
  fetchCortesEvaluativos: () => Promise<void>
}

export default function AddCorteEvaluativoModal({ fetchCortesEvaluativos }: AddCorteEvaluativoModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { toast } = useToast()
  return (
    <div>
      <BtnOpenAddModal onClick={() => setShowModal(true)} />
      {showModal && (
        <ModalBase
          onshowModal={showModal}
          onCloseModal={() => setShowModal(false)}
          content={
            <CorteEvaluativoForm
              onSuccess={() => {
                // mostrar notificación bonita
                toast({
                  title: "Corte evaluativo guardado",
                  description: "El corte evaluativo se guardó correctamente.",
                  variant: "success",
                })
                fetchCortesEvaluativos()
                setShowModal(false)
              }}
            />
          }
        />
      )}
    </div>
  )
}
