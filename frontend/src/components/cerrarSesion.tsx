import { useAuth } from "@/hooks/useAuth"
import { LogOut } from "lucide-react"

export default function CerrarSesion() {
  const { logout, isLoggingOut } = useAuth()

  return (
    <button
      onClick={() => logout()}
      className={`w-full flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 font-semibold shadow-sm transition-all duration-200
        ${isLoggingOut
          ? 'border border-slate-600 bg-slate-700 text-slate-300 cursor-not-allowed'
          : 'border border-rose-500/60 bg-slate-800 text-rose-100 hover:bg-rose-950/25 hover:border-rose-400'}`}
      disabled={isLoggingOut}
    >
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
    </button>
  )
}