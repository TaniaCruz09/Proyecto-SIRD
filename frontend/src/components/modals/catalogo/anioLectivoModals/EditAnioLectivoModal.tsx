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
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const handleOpenModal = async () => {
        if (isLoadingDetail) {
            return;
        }

        setIsLoadingDetail(true);

        try {
            const fullAnioLectivo = await getAnioLectivoById(añoLectivo.id);
            setAnioLectivoToEdit(fullAnioLectivo || añoLectivo);
            setShowModal(true);
        } catch (error) {
            console.error("No se pudo cargar el detalle del año lectivo para edición", error);
            setAnioLectivoToEdit(añoLectivo);
            setShowModal(true);
        } finally {
            setIsLoadingDetail(false);
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
                            key={`${anioLectivoToEdit.id}-${anioLectivoToEdit.periodos?.length ?? 0}`}
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
