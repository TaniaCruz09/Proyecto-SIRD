"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react"

interface Toast {
    id: number
    title: string
    description?: string
    variant?: "default" | "destructive" | "success"
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

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <ToastContainer toasts={toasts} />
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
function ToastContainer({ toasts }: { toasts: Toast[] }) {
    return (
        <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
            {toasts.map(({ id, title, description, variant }) => (
                    <div
                        key={id}
                        className={`max-w-xs w-full rounded-md p-4 shadow-lg text-white
                    ${variant === "destructive" ? "bg-red-600" : variant === "success" ? "bg-green-600" : "bg-gray-900"}`}
                    >
                    <strong className="block font-bold">{title}</strong>
                    {description && <p className="mt-1 text-sm">{description}</p>}
                </div>
            ))}
        </div>
    )
}
