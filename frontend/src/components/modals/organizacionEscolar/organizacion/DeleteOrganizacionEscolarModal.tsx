import BtnDelete from '@/components/Buttons/BtnDelete'
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion';
import { deleteOrganizacionEscolar } from '@/actions/organizacionEscolarMethods/organizacionMethods';
import { useToast } from '@/hooks/use-toast'

interface DeleteOrganizacionEscolarModalProps {
    idEliminar: number;
    fetchOrganizacionEscolar: () => Promise<void>;
}

export default function DeleteOrganizacionEscolarModal({ idEliminar, fetchOrganizacionEscolar }: DeleteOrganizacionEscolarModalProps) {
    const { toast } = useToast()
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
            toast({ title: "Organización eliminada", description: "La organización escolar se eliminó correctamente.", variant: "success" })
            await fetchOrganizacionEscolar();
        } catch (error) {
            toast({ title: "Error", description: "No se pudo eliminar la organización escolar.", variant: "destructive" })
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
                title="¿Eliminar organización escolar?"
                description="Se eliminará toda la información de esta organización: grupos, asignaturas, docentes, estudiantes y calificaciones."
            />

        </div>
    )
}
