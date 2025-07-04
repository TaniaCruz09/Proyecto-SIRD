import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface BtnDeleteProps {
  onClick: ()=>void;
}

export default function BtnDelete({ onClick }: BtnDeleteProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="bg-red-300/30 hover:bg-red-400 text-red-600 text-bold px-4 py-2 rounded-md text-sm cursor-pointer"
      >
        <RiDeleteBin6Line />
      </button>
    </div>
  );
}
