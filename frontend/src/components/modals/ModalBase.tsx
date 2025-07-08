"use client";

import { useEffect, useState } from "react";
import { GrLogout } from "react-icons/gr";
import { IoExitOutline } from "react-icons/io5";

interface ModalBaseProps {
  onshowModal: boolean;
  onCloseModal: () => void;
  content?: React.ReactNode;
}

const ModalBase = ({onshowModal, content, onCloseModal }: ModalBaseProps) => {
  if(!onshowModal) return null
  const [animateIn, setAnimateIn] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onCloseModal();
      setAnimateOut(false);
      setAnimateIn(false);
    }, 300); // debe coincidir con duration
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div
        className={`bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative transform transition-all duration-300 ease-in-out flex justify-center item-center
          ${
            animateIn && !animateOut
              ? "scale-100 opacity-100"
              : "-translate-y-5 opacity-0"
          }
        `}
      >
        <button
          onClick={handleClose}
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
