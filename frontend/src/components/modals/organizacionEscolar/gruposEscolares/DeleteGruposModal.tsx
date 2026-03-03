import { deleteGrupo } from '@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods';
import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../ModalConfirmDeletion';
import { useToast } from '@/hooks/use-toast';

interface DeleteGruposModalProps {
    idEliminar: number;
    fetchGrupos: () => Promise<void>;
}

export default function DeleteGruposModal({ idEliminar, fetchGrupos }: DeleteGruposModalProps) {
    const [grupoToDelete, setGrupoToDelete] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const { toast } = useToast();
    const handleDeleteClick = (id: number) => {
        setGrupoToDelete(id);
        setShowConfirm(true);

    }

    const confirmDelete = async () => {
        if (!grupoToDelete) return;
        try {
            await deleteGrupo(grupoToDelete);
            await fetchGrupos();
            toast({
                title: 'Grupo eliminado',
                description: 'El grupo se eliminó correctamente.',
                variant: 'success',
            });
        } catch (error) {
            console.error("Error al eliminar el grupo", error);
            toast({
                title: 'Error al eliminar',
                description: 'No se pudo eliminar el grupo.',
                variant: 'destructive',
            });
        } finally {
            setShowConfirm(false);
            setGrupoToDelete(null);
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
