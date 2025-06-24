"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface BtnOpenEditModalProps {
    onClick: ()=> void
}

export default function BtnOpenEditModal({onClick}: BtnOpenEditModalProps) {

  return (
      <button
        onClick={onClick}
        className="bg-yellow-300/30 text-bold hover:bg-yellow-300 text-yellow-600 px-4 py-2 rounded-md text-sm"
      >
        <FaEdit />
      </button>
  );
}

