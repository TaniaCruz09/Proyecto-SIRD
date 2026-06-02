'use client';

interface ModalConfirmacionProps {
  show: boolean;
  title?: string;
  message?: string;
  email?: string;
  onClose?: () => void;
  autoClose?: boolean;
  stage?: 'sending' | 'success';
  showSpinner?: boolean;
}

export default function ModalConfirmacion({
  show,
  title = 'Confirmación',
  message = '',
  email,
  onClose,
  autoClose = false,
  stage,
  showSpinner = false,
}: ModalConfirmacionProps) {
  if (!show) return null;

  const isLoading = stage === 'sending' || showSpinner;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center animate-fadeIn">
        {/* 🔹 Título */}
        <h2 className="text-xl font-semibold text-blue-700 mb-3">{title}</h2>

        {/* 🔹 Mensaje */}
        {message && (
          <p className="text-gray-600 text-sm mb-2 leading-relaxed">
            {message}
          </p>
        )}

        {/* 🔹 Correo (si lo hay) */}
        {email && (
          <p className="text-gray-800 font-medium text-sm mb-4 break-all">{email}</p>
        )}

        {/* 🔹 Círculo de carga (spinner) */}
        {isLoading && (
          <div className="flex justify-center my-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* 🔹 Animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
