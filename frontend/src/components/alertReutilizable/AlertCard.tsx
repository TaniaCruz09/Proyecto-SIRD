import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

type AlertType = "success" | "error";

interface AlertCardProps {
  type?: AlertType;
  title?: string;
  message?: string;
  buttonText?: string;
  onAction?: () => void;
  show?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({
  type = "success",
  title,
  message,
  buttonText,
  onAction,
  show = false,
}) => {
  if (!show) return null;

  const isError = type === "error";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo semitransparente */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Contenedor de la tarjeta */}
      <div
        className={`relative max-w-sm w-full mx-4 rounded-3xl shadow-2xl overflow-hidden text-center animate-fadeIn z-10 ${
          isError ? "bg-red-100" : "bg-green-100"
        }`}
      >
        {/* Encabezado */}
        <div
          className={`p-6 rounded-t-3xl ${
            isError ? "bg-red-500" : "bg-green-500"
          } flex justify-center`}
        >
          {isError ? (
            <AlertTriangle className="w-16 h-16 text-white" />
          ) : (
            <CheckCircle className="w-16 h-16 text-white" />
          )}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-b-3xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {title || (isError ? "Error Message!" : "Task Completed!")}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {message ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </p>
          <button
            onClick={onAction}
            className={`px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 ${
              isError
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {buttonText || (isError ? "Learn More" : "Close Window")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
