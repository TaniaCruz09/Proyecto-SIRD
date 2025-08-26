import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface BtnDeleteProps {
  onClick: () => void;
}

export default function BtnDelete({ onClick }: BtnDeleteProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="bg-red-300/50 hover:bg-red-300 text-red-600 text-bold px-3 py-2 rounded-sm shadow-md transition cursor-pointer"
      >
        <RiDeleteBin6Line size={16} />
      </button>
    </div>
  );
}
