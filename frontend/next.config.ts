import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: false,
  // Next bloquea los recursos de desarrollo (_next/*) si se piden desde otro
  // origen. Necesario para abrir el dev server desde otra PC de la red local.
  // Debe ir la IP real del equipo; con un valor de ejemplo ("192.168.1.xxx")
  // la página carga en blanco porque el JS no llega a hidratarse.
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "192.168.1.136",
    "192.168.1.136:3000",
  ],
};

export default nextConfig;
