"use client";
import { GrLogout } from "react-icons/gr";
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
          className="absolute right-3 top-3 z-20 text-2xl font-bold text-gray-400 transition-colors hover:text-red-600/80"
        >
          <GrLogout />
        </button>
            <div className="w-full">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
