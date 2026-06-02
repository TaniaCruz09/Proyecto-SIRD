"use client"
import { eliminarEstudianteAsignado } from '@/actions/organizacionEscolarMethods/asignacionEstudiantesMethods';
import BtnDelete from '@/components/Buttons/BtnDelete';
import React, { useState } from 'react'
import ConfirmDeletModal from '../../modalConfirmDeletion';

interface DeleteEstudianteGrupoProps {
  grupoId: number;
  estudianteId: number;
  fetchGrupoConEstudiantes: () => Promise<void>;
}

export default function DeleteEstudianteDeGrupoModal({ grupoId, estudianteId, fetchGrupoConEstudiantes }: DeleteEstudianteGrupoProps) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState<{ grupoId: number, estudianteId: number } | null>(null);

  const handleEliminar = (grupoId: number, estudianteId: number) => {
    setEstudianteAEliminar({ grupoId, estudianteId });
    setShowConfirm(true)
  }

  console.log(estudianteAEliminar)

  const confirmDelete = async () => {
    if (!estudianteAEliminar) return;
    try {
      await eliminarEstudianteAsignado(estudianteAEliminar.grupoId, estudianteAEliminar.estudianteId);
      await fetchGrupoConEstudiantes(); // refresca la lista
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    } finally {
      setShowConfirm(false);
      setEstudianteAEliminar(null);
    }
  };

  return (
    <div>
      <BtnDelete onClick={() => handleEliminar(grupoId, estudianteId)} />
      <ConfirmDeletModal
        onshow={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
