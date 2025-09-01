"use client";
import { ReactNode } from "react";
import { Trash2 } from "lucide-react"; // icono de papelera

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Eliminar elemento",
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-center">
        {/* Icono rojo */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <Trash2 className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Botones */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
