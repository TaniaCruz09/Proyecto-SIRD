import BtnOpenAddModal from '@/components/Buttons/btnOpenAddModal';
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import OrganizacionEscolarForm from '@/components/forms/organizacionEscolarForms/OrganizacionEscolarForm';
import { OrganizacionEscolarConAnioLectivoForm } from '@/components/forms/organizacionEscolarForms/OrganizacionEscolarConAñoLectivoForm';

interface AddOganizacionEscolarConAnioLectivoModalProp {
    fetchOrganizacionPorAnioLectivo: () => Promise<void>
    idAnioLectivo: number
}

export default function AddOganizacionEscolarConAnioLectivoModal({ fetchOrganizacionPorAnioLectivo, idAnioLectivo }: AddOganizacionEscolarConAnioLectivoModalProp) {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <div>
            <BtnOpenAddModal text={"Agregar nueva organizacion"} onClick={() => setShowModal(true)} />
            {
                showModal && (
                    <ModalBase
                        onshowModal={showModal}
                        onCloseModal={() => setShowModal(false)}
                        content={
                            <OrganizacionEscolarConAnioLectivoForm
                                idAnioLectivo={idAnioLectivo}
                                onSuccess={() => {
                                    fetchOrganizacionPorAnioLectivo()
                                    setShowModal(false)
                                }} />
                        }
                    />
                )
            }
        </div>
    )
}
