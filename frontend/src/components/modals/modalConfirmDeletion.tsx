"use client";
import React from 'react'
import { IoWarningOutline } from 'react-icons/io5';

interface ConfirmDeleteModalProps {
    onshow: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export default function ConfirmDeletModal({ onshow, onCancel, onConfirm }: ConfirmDeleteModalProps) {
    if (!onshow) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center relative">
                <div className="flex justify-center mb-3">
                    <div className='flex items-center justify-center text-red-500 text-2xl w-10 h-10 rounded-full bg-red-100'>
                        <IoWarningOutline />
                    </div>
                </div>
                <p className="text-lg font-semibold mb-4 text-gray-700">
                    ¿Estás seguro de eliminar?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-white px-4 py-2 rounded-md hover:bg-gray-300 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
