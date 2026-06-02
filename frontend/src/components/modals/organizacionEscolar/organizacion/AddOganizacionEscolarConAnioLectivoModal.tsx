import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { OrganizacionEscolarConAnioLectivoForm } from '@/components/forms/organizacionEscolarForms/OrganizacionEscolarConAñoLectivoForm';
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

interface AddOganizacionEscolarConAnioLectivoModalProp {
    idAnioLectivo: number
    onSuccess?: () => void | Promise<void>
}

export default function AddOganizacionEscolarConAnioLectivoModal({ idAnioLectivo, onSuccess }: AddOganizacionEscolarConAnioLectivoModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <div>
            <Button
                size="sm"
                onClick={() => setShowModal(true)}
                className="ml-4 bg-emerald-500 hover:bg-emerald-600 text-white border-t border-slate-200"
            >
                <Plus className="h-4 w-4" />
                <span>Agregar nueva organización</span>
            </Button>

            {
                showModal && (
                    <ModalBase
                        onshowModal={showModal}
                        onCloseModal={() => setShowModal(false)}
                        content={
                            <OrganizacionEscolarConAnioLectivoForm
                                idAnioLectivo={idAnioLectivo}
                                onSuccess={async () => {
                                    await onSuccess?.()
                                    setShowModal(false)
                                }} />
                        }
                    />
                )
            }
        </div>
    )
}
