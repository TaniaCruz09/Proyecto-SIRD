import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { AnioLectivo } from '@/interfaces';
import { AnioLectivoForm } from '@/components/forms/catalogoForms/anioLectivoForm';
import { getAnioLectivoById } from '@/actions/catalogos/anioLectivoMethods';

interface EditAñoLectivoModalProp {
    añoLectivo: AnioLectivo;
    fetchAñoLectivo: () => Promise<void>;
}

export default function EditAñoLectivoModal({ añoLectivo, fetchAñoLectivo }: EditAñoLectivoModalProp) {
    const [showModal, setShowModal] = useState(false);
    const [anioLectivoToEdit, setAnioLectivoToEdit] = useState<AnioLectivo>(añoLectivo);

    const handleOpenModal = async () => {
        setShowModal(true);

        try {
            const fullAnioLectivo = await getAnioLectivoById(añoLectivo.id);
            if (fullAnioLectivo) {
                setAnioLectivoToEdit(fullAnioLectivo);
            }
        } catch (error) {
            console.error("No se pudo cargar el detalle del año lectivo para edición", error);
            setAnioLectivoToEdit(añoLectivo);
        }
    };

    return (
        <div>
            <BtnOpenEditModal onClick={handleOpenModal} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    containerClassName="max-w-6xl overflow-hidden p-0"
                    content={
                        <AnioLectivoForm
                            defaultValues={anioLectivoToEdit}
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
