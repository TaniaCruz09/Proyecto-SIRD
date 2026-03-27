import { useAuth } from "@/hooks/useAuth"
import { LogOut } from "lucide-react"

export default function CerrarSesion() {
  const { logout, isLoggingOut } = useAuth()

  return (
    <>
      <button
        onClick={() => logout()}
        className={`flex items-center justify-between gap-x-2 shadow-sm rounded-lg px-3 py-2 font-medium transition
          ${isLoggingOut ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-red-500'}`}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <span>Saliendo...</span>
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </>
        )}
      </button>

      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Saliendo...</p>
        </div>
      )}
    </>
  )
}