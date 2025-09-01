"use client";
import { GrLogout } from "react-icons/gr";
interface ModalBaseProps {
  onshowModal: boolean;
  onCloseModal: () => void;
  content?: React.ReactNode;
}

const ModalBase = ({ onshowModal, content, onCloseModal }: ModalBaseProps) => {
  if (!onshowModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div
        className={`bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[calc(100vh-80px)] mx-4 relative flex justify-center item-center
        `}
      >
        <button
          onClick={onCloseModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600/80 text-2xl font-bold"
        >
          <GrLogout />
        </button>
        {content}
      </div>
    </div>
  );
};

export default ModalBase;
