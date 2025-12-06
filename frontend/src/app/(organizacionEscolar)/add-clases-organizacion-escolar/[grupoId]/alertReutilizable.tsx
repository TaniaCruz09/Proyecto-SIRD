"use client";
import { useEffect } from "react";

interface ReusableAlertProps {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export default function ReusableAlert({
  open,
  message,
  type = "warning",
  onClose,
}: ReusableAlertProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 2500); // se cierra solo
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const colors: Record<string, string> = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className={`border-l-4 p-4 rounded shadow-md w-72 ${colors[type]}`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-4 font-bold">
            ✖
          </button>
        </div>
      </div>
    </div>
  );
}
