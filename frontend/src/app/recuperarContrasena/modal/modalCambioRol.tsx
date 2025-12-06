'use client'
import { FC } from 'react'
import { Dialog } from '@headlessui/react'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Contenido del modal */}
      <div className="bg-white rounded-xl shadow-lg p-6 z-50 w-96 max-w-full mx-4">
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        <p className="text-sm text-gray-700 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Aceptar
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmModal
