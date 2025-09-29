import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { AnioLectivo } from '@/interfaces';
import { AnioLectivoForm } from '@/components/forms/catalogoForms/anioLectivoForm';

interface EditAñoLectivoModalProp {
    añoLectivo: AnioLectivo;
    fetchAñoLectivo: () => Promise<void>;
}

export default function EditAñoLectivoModal({ añoLectivo, fetchAñoLectivo }: EditAñoLectivoModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <AnioLectivoForm
                            defaultValues={añoLectivo}
                            onSuccess={() => {
                                fetchAñoLectivo();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
