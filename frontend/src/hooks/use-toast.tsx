"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"

interface Toast {
    id: number
    title: string
    description?: string
    variant?: "default" | "destructive" | "success" | "warning" | "info"
}

interface ToastContextType {
    toast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastCount = 0

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((toastData: Omit<Toast, "id">) => {
        const id = ++toastCount
        setToasts((prev) => [...prev, { id, ...toastData }])

        // Eliminar el toast después de 3 segundos
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }, [])

    const dismissToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast debe usarse dentro de un ToastProvider")
    }
    return context
}

// Componente que muestra los toasts en pantalla (abajo a la derecha)
function ToastContainer({
    toasts,
    onDismiss,
}: {
    toasts: Toast[]
    onDismiss: (id: number) => void
}) {
    return (
        <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
            {toasts.map(({ id, title, description, variant }) => {
                const type = variant === "destructive" ? "error" : variant === "success" ? "success" : variant === "warning" ? "warning" : "info";
                const styles =
                    type === "success"
                        ? "border-green-400 text-green-700"
                        : type === "warning"
                            ? "border-yellow-400 text-yellow-700"
                            : type === "error"
                                ? "border-red-400 text-red-700"
                                : "border-blue-400 text-blue-700";

                const iconColor =
                    type === "success"
                        ? "bg-green-100 text-green-600"
                        : type === "warning"
                            ? "bg-yellow-100 text-yellow-600"
                            : type === "error"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600";

                return (
                    <div
                        key={id}
                        className={`pointer-events-auto max-w-xs w-full rounded-md border-l-4 bg-white p-4 shadow-lg ring-1 ring-black/5 ${styles}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${iconColor}`}>
                                {type === "success" && (
                                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                        <path d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.5 7.6a1 1 0 0 1-1.42 0l-3.5-3.55a1 1 0 1 1 1.424-1.406l2.789 2.83 6.79-6.882a1 1 0 0 1 1.411-.007Z" />
                                    </svg>
                                )}
                                {type === "info" && (
                                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1.2 9H8.8a.8.8 0 0 1 0-1.6h.4V9.4h-.4a.8.8 0 0 1 0-1.6h1.6a.8.8 0 0 1 .8.8v4.3h.4a.8.8 0 0 1 0 1.6Z" />
                                    </svg>
                                )}
                                {type === "warning" && (
                                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                        <path d="M9.002 2.5a1 1 0 0 1 1.996 0l.96 7.2a1 1 0 0 1-.995 1.13H9.037a1 1 0 0 1-.995-1.13l.96-7.2ZM10 14.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                                    </svg>
                                )}
                                {type === "error" && (
                                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                        <path d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414L11.414 10l2.293 2.293a1 1 0 0 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 0-1.414Z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <strong className="block font-semibold text-slate-900">{title}</strong>
                                {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDismiss(id);
                                }}
                                className="text-slate-400 hover:text-slate-700"
                                aria-label="Cerrar"
                            >
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                    <path d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414L11.414 10l2.293 2.293a1 1 0 0 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 0-1.414Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
