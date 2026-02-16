"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import NavbarAdmin from "@/components/navbarAdmin";
import { ToastProvider } from "@/hooks/use-toast";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <NavbarAdmin />
          <main className="w-screen text-center bg-gray-100 overflow-auto">
            {children}
          </main>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
