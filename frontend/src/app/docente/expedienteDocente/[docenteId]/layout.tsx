import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Expediente Docente",
    description: "Expeidente para poder ver la informacion e historial del docente.",
};

export default function ExpedienteDocenteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>
}