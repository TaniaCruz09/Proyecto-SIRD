import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion';
import { deleteOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';

interface DeleteOrganizacionEscolarModalProps {
    idEliminar: number;
    fetchOrganizacionEscolar: () => Promise<void>;
}

export default function DeleteOrganizacionEscolarModal({ idEliminar, fetchOrganizacionEscolar }: DeleteOrganizacionEscolarModalProps) {
    const [organizacionEscolarToDelete, setOrganizacionEscolarToDelete] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const handleDeleteClick = (id: number) => {
        setOrganizacionEscolarToDelete(id);
        setShowConfirm(true);

    }

    const confirmDelete = async () => {
        if (!organizacionEscolarToDelete) return;
        try {
            await deleteOrganizacionEscolar(organizacionEscolarToDelete);
            await fetchOrganizacionEscolar();
        } catch (error) {
            console.error("Error al eliminar la organizacion laboral", error);
        } finally {
            setShowConfirm(false);
            setOrganizacionEscolarToDelete(null);
        }
    }
    return (
        <div>
            <BtnDelete onClick={() => handleDeleteClick(idEliminar)} />
            <ConfirmDeletModal
                onshow={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
            />

        </div>
    )
}
