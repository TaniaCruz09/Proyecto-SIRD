"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import NavbarAdmin from "@/components/navbarAdmin";
import { ToastProvider } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

const queryClient = new QueryClient();

function AppShell({ children }: { children: ReactNode }) {
  const { isLoggingOut, rol } = useAuth();
  const pathname = usePathname();
  const rutasPublicas = [
    "/",
    "/auth/login",
    "/auth/selectRole",
    "/recuperarContrasena",
    "/recuperarContrasena/verificarCodigo",
    "/recuperarContrasena/restablecerContrasena",
  ];

  const bloqueandoVistaProtegida = !rol && !rutasPublicas.includes(pathname);

  if (isLoggingOut || bloqueandoVistaProtegida) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-lg font-semibold text-gray-800">Cerrando sesión...</p>
        <p className="mt-1 text-sm text-gray-500">
          {isLoggingOut ? "Limpiando la sesión y redirigiendo al acceso." : "Redirigiendo al acceso..."}
        </p>
      </div>
    );
  }

  return (
    <>
      <NavbarAdmin />
      <main className="w-screen text-center bg-gray-100 overflow-auto">
        {children}
      </main>
    </>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
