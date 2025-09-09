import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agregar estudiantes a un grupo",
    description: "Formulario para registrar nuevos estudiantes en el sistema.",
};

export default function RegisterEstudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}