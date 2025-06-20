"use cliente"
import React from 'react'

interface ConfirmDeleteModalProps {
    visible: boolean;
    onConfirm: ()=> Promise<void>;
    onCancel: ()=> void
}

export default function ConfirmDeletModal({visible, onCancel, onConfirm}: ConfirmDeleteModalProps){
    if (!visible) return null;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center relative">
                <p className="text-lg font-semibold mb-4">¿Estás seguro de eliminar este usuario?</p>
                <div className="flex justify-center gap-4">
                    <button
                    onClick={onConfirm}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                    Sí, eliminar
                    </button>
                    <button
                    onClick={onCancel}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                    Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}