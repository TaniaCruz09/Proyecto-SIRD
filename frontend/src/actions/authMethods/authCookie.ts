"use server";

import { cookies } from "next/headers";

// Establece la cookie 'token' en el DOMINIO del frontend (Vercel).
// Es necesaria para que el middleware (proxy.ts) pueda validar el acceso
// a rutas protegidas (/admin, /docente) en producción, donde el frontend
// y el backend viven en dominios distintos.
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

// Elimina la cookie 'token' del dominio del frontend
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
