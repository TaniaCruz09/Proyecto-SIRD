"use client";
import { X } from "lucide-react";
interface ModalBaseProps {
  onshowModal: boolean;
  onCloseModal: () => void;
  content?: React.ReactNode;
  containerClassName?: string;
}

const ModalBase = ({ onshowModal, content, onCloseModal, containerClassName }: ModalBaseProps) => {
  if (!onshowModal) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]">
      <div className="h-full w-full overflow-y-auto px-2 py-3 sm:px-4 sm:py-6">
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div
            className={`relative w-full rounded-3xl border border-slate-200 bg-white shadow-2xl max-h-[calc(100dvh-24px)] overflow-y-auto sm:max-h-[calc(100dvh-48px)]
            ${containerClassName ?? "max-w-lg p-6"}
            `}
          >
        <button
          onClick={onCloseModal}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </button>
            <div className="w-full">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
