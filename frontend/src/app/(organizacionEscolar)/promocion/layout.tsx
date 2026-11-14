import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promoción de estudiantes",
  description:
    "Crea el año lectivo nuevo y promueve a los estudiantes al grado siguiente.",
};

export default function PromocionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
